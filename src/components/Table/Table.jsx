import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import Modal from 'react-modal'

import InputModal from '../common/InputModal/InputModal'

import './Table.scss'

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '30px 20px 0',
    minWidth: 500
  }
}

class Table extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalIsOpen: false,
      modalAmountIsOpen: false,
      postError: null,
      result: {},
      approval: {},
      currentData: null,
      param: {},
      fillLoanAmount: 0,
    }

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  onChange(key, value, affection = null) {
    const formData = this.state
    formData[key] = value
    this.setState(formData)
  }

  openModal(key) {
    this.setState({ [key]: true })
  }

  closeModal(key) {
    this.setState({ [key]: false, fillLoanAmount: 0 })
  }

  getData(data) {
    const { key, filter } = data.data
    if (key) {
      const ret = this.props.data[key] || []
      if (filter) return filter(ret)
      return ret
    }
    return data.data
  }

  addCommas(value) {
    return (value + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  }

  calcTerm(value) {
    return `${parseInt(value / 3600 / 24, 10)}d` + (value / 3600 % 24 !== 0 ? ` ${parseInt(value / 3600 % 24, 10)}h` : '')
  }

  setPrecision(value, prec) {
    const up = parseInt(value, 10)
    const down = ('000' + parseInt(value * Math.pow(10, prec), 10).toString()).substr(-prec)
    return this.addCommas(up) + '.' + down
  }

  shortAddress(value) {
    return `${value.substr(0, 4)}...${value.substr(-4)}`
  }

  getDisplayData(data, header) {
    let ret = data[header.key]

    if (header.key === 'loanDuration') {
      ret = ret.split(' ')[0]
    }

    if (header.precision) ret = this.setPrecision(ret, header.precision)
    if (header.filter) ret = this[header.filter](ret)
    if (header.suffix) ret += header.suffix
    return ret
  }

  onConfirm() {
    const { approval, currentData } = this.state
    const { methods } = this.props
    this.setState({
      isLoading: true
    }, () => {
      methods.onFillLoan(approval, (err, result) => {
        console.log('Fill Loan', err, result)
        if (result) {
          methods.onFillOrderServer(currentData.id, approval["_values"][12], (err, res) => {
            setTimeout(methods.getOffers, 1000)
            setTimeout(methods.getPositions, 3000)
          })
        }
        this.setState({
          isLoading: false
        }, () => this.closeModal('modalIsOpen'))
      })
    })
  }

  onSubmitOrder() {
    this.setState({
      isLoading: true
    }, () => {
      setTimeout(() => {
        const { address, methods, web3Utils } = this.props
        const { currentData, fillLoanAmount } = this.state
        const _this = this

        const postData = Object.assign({
          filler: address,
          fillLoanAmount: web3Utils.toWei(fillLoanAmount)
        }, currentData)

        methods.onPostLoans(postData, (err, res) => {
          if (err) {
            return _this.setState({
              postError: err,
              isLoading: false,
            }, () => {
              _this.closeModal('modalAmountIsOpen')
              _this.openModal('modalIsOpen')
            })
          }
          if (res) {
            const approval = res.approval
            const result = res.data
            Object.keys(result).forEach(key => {
              if (key === 'expiresAtTimestamp')
                result[key] = moment.utc(result[key] * 1000).format('YYYY-MM-DD HH:mm Z')
              else if (result[key].toString().indexOf('0x') !== 0 && key !== 'nonce')
                result[key] = web3Utils.fromWei(result[key])
            })
            _this.setState({
              postError: null,
              result,
              approval,
              isLoading: false,
            }, () => {
              _this.closeModal('modalAmountIsOpen')
              _this.openModal('modalIsOpen')
            })
          }
        })
      }, 500)
    });
  }

  // Slots

  onOrder(data, param) {
    this.setState({
      currentData: Object.assign({ loanAmount: data.loanAmount }, data),
      param,
      fillLoanAmount: data.loanAmount,
    }, () => this.openModal('modalAmountIsOpen'))
  }

  // Action

  onAction(action, data) {
    if (!action.slot) return
    this[action.slot](data, action.param)
  }

  render() {
    const { data, classes } = this.props
    const { postError, result, modalIsOpen, modalAmountIsOpen, currentData, param, fillLoanAmount, isLoading } = this.state
    const filteredData = this.getData(data)

    return (
      <div className="TableWrapper">
        {
          data.loading &&
          <div className="Loading">
            <div className="Loader" />
          </div>
        }
        <div className="Title">{data.title}</div>
        <div class="tbl-header">
          <table cellpadding="0" cellspacing="0" border="0">
            <thead>
              <tr>
                {
                  data.headers.map(h => (
                    <th style={h.style}>{h.label}</th>
                  ))
                }
                <th></th>
              </tr>
            </thead>
          </table>
        </div>
        <div class={`tbl-content ${classes}`}>
          <div>
            <table cellpadding="0" cellspacing="0" border="0">
              <tbody>
                {
                  filteredData.map(d => (
                    <tr>
                      {
                        data.headers.map(h => (
                          <td style={h.style}>{this.getDisplayData(d, h)}</td>
                        ))
                      }
                      <td>
                        {
                          data.action.label === '3-dot' ?
                            <button style={data.action.style} className="three-dot">
                              <div className="dot" />
                              <div className="dot" />
                              <div className="dot" />
                            </button>
                            : <button style={data.action.style} onClick={() => this.onAction(data.action, d)}>{data.action.label}</button>
                        }
                      </td>
                    </tr>
                  ))
                }
                {
                  filteredData.length === 0 && <tr><td colSpan={data.headers.length}>No Data</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => this.closeModal('modalIsOpen')}
          style={customStyles}
          contentLabel="Order Book"
        >
          <h2>ORDER BOOK</h2>
          <button onClick={() => this.closeModal('modalIsOpen')}></button>
          <div className="ModalBody">
            {
              postError ?
                <div className="Error">{postError.toString()}</div>
                :
                <div>
                  {
                    isLoading &&
                    <div className="Loading">
                      <div className="Loader" />
                    </div>
                  }
                  <div className="Info">
                    <table>
                      {
                        Object.keys(result).map(key => (
                          <tr>
                            <td>{key}</td>
                            <td>{result[key].toString()}</td>
                          </tr>
                        ))
                      }
                    </table>
                  </div>
                  <div className="Buttons">
                    <div className="Confirm" onClick={this.onConfirm.bind(this)}>Confirm</div>
                  </div>
                </div>
            }
          </div>
        </Modal>
        <InputModal
          isOpen={modalAmountIsOpen}
          title={`Amount to ${param.isLend ? 'Borrow' : 'Lend'}`}
          onRequestClose={() => this.closeModal('modalAmountIsOpen')}
          onChange={(e) => this.setState({ fillLoanAmount: e.target.value })}
          onSubmit={this.onSubmitOrder.bind(this)}
          contentLabel={`Amount to ${param.isLend ? 'Borrow' : 'Lend'}`}
          value={fillLoanAmount}
          max={currentData ? currentData.loanAmount : 0}
          suffix={param.isLend ? 'DAI' : 'DAI'}
          disabled={fillLoanAmount > (currentData ? currentData.loanAmount : 0)}
          isLoading={isLoading}
        />
      </div >
    )
  }
}

export default Table
