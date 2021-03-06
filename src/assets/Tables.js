const fillZero = (len = 40) => {
  return '0x' + (new Array(len)).fill(0).join('')
}

const checkLoanCanBeLiquidated = (data) => {
  return data.origin.expiresAtTimestamp < Date.now() && data.status === 'Active'
}

const checkLoanCanBeClosed = (data) => {
  return (data.origin.userAddress.toLowerCase() === data.origin.borrower.toLowerCase()) && data.status === 'Active'
}

const checkLoanCanBeCleaned = (data) => {
  return (data.origin.userAddress.toLowerCase() === data.origin.borrower.toLowerCase()) && data.status === 'Closed'
}

const CreateTables = (web3Utils) => ([
  {
    title: 'Lend Order Book',
    headers: [
      {
        label: 'Amount',
        key: 'loanAmount',
        precision: 3,
        style: { textAlign: 'left' }
      }, {
        label: 'Term',
        key: 'loanDuration',
        filter: 'calcTerm'
      }, {
        label: 'Rate',
        key: 'interestRate',
        precision: 3,
        suffix: '%'
      }
    ],
    data: {
      key: 'offers',
      filter: (d) => (
        d
          .filter(item => (item.lender && item.lender !== fillZero()))
          .sort((a, b) => (new Date(a.created_at).getTime() < new Date(b.created_at).getTime() ? 1 : -1))
          .map(item => {
            item.interestRate = web3Utils.fromWei(item.interestRatePerDay)
            item.loanAmount = web3Utils.substractBN(item.loanAmountOffered, item.loanAmountFilled || 0)
            return item
          })
      )
    },
    action: {
      label: 'Borrow',
      slot: 'onOrder',
      param: { isLend: true }
    }
  }, {
    title: 'Borrow Order Book',
    headers: [
      {
        label: 'Rate',
        key: 'interestRate',
        precision: 3,
        suffix: '%',
        style: { textAlign: 'left' }
      }, {
        label: 'Term',
        key: 'loanDuration',
        filter: 'calcTerm'
      }, {
        label: 'Amount',
        key: 'loanAmount',
        precision: 3,
      }
    ],
    data: {
      key: 'offers',
      filter: (d) => (
        d
          .filter(item => (item.borrower && item.borrower !== fillZero()))
          .sort((a, b) => (new Date(a.created_at).getTime() < new Date(b.created_at).getTime() ? 1 : -1))
          .map(item => {
            item.interestRate = web3Utils.fromWei(item.interestRatePerDay)
            item.loanAmount = web3Utils.substractBN(item.loanAmountOffered, item.loanAmountFilled || 0)
            return item
          })
      )
    },
    action: {
      label: 'Lend',
      slot: 'onOrder',
      param: { isLend: false }
    }
  }, {
    title: 'MY LEND ORDERS',
    headers: [
      {
        label: 'Amount',
        key: 'loanAmount',
        precision: 2,
        style: { fontFamily: 'Space Mono', width: '33%' }
      }, {
        label: 'Total Interest ',
        key: 'totalInterest',
        precision: 5,
        style: { fontFamily: 'Space Mono', width: '40%' }
      }, {
        label: 'Term',
        key: 'loanDuration',
        filter: 'calcTerm',
        style: { fontFamily: 'Space Mono', width: '27%' }
      }
    ],
    data: {
      key: 'myLendOffers',
      filter: (d) => (
        d
          .sort((a, b) => (new Date(a.created_at).getTime() < new Date(b.created_at).getTime() ? 1 : -1))
          .map(item => {
            item.totalInterest = web3Utils.fromWei(item.loanAmountOffered) * web3Utils.fromWei(item.interestRatePerDay)
            item.loanAmount = web3Utils.substractBN(item.loanAmountOffered, item.loanAmountFilled || 0)
            return item
          })
      )
    },
    action: {
      key: 'close',
      slot: 'onCancel',
      param: { isLend: true }
    }
  }, {
    title: 'MY BORROW ORDERS',
    headers: [
      {
        label: 'Amount',
        key: 'loanAmount',
        precision: 2,
        style: { fontFamily: 'Space Mono', width: '33%' }
      }, {
        label: 'Total Interest ',
        key: 'totalInterest',
        precision: 5,
        style: { fontFamily: 'Space Mono', width: '40%' }
      }, {
        label: 'Term',
        key: 'loanDuration',
        filter: 'calcTerm',
        style: { fontFamily: 'Space Mono', width: '27%' }
      }
    ],
    data: {
      key: 'myBorrowOffers',
      filter: (d) => (
        d
          .sort((a, b) => (new Date(a.created_at).getTime() < new Date(b.created_at).getTime() ? 1 : -1))
          .map(item => {
            item.totalInterest = web3Utils.fromWei(item.loanAmountOffered) * web3Utils.fromWei(item.interestRatePerDay)
            item.loanAmount = web3Utils.substractBN(item.loanAmountOffered, item.loanAmountFilled || 0)
            return item
          })
      )
    },
    action: {
      key: 'close',
      slot: 'onCancel',
      param: { isLend: false }
    }
  }, {
    title: 'MY LEND POSITIONS',
    headers: [
      {
        label: 'Loan Number',
        key: 'loanNumber',
        style: { fontFamily: 'Space Mono', width: '100%' }
      }, {
        label: 'Amount',
        key: 'amount',
        precision: 2,
      }, {
        label: 'Total Interest ',
        key: 'totalInterest',
        precision: 5,
      }, {
        label: 'Term',
        key: 'term',
        filter: 'calcTerm',
      }, {
        label: 'Loan Health',
        key: 'health',
        suffix: '%',
      }, {
        label: 'Loan Status',
        key: 'status',
      },
    ],
    data: {
      key: 'lent',
      test: [
        { loanNumber: '0x7faeddf6825824f133831811771b74aff7a4be6c', amount: 13.83, totalInterest: 0.11064, term: 156, health: 80 },
        { loanNumber: '0x7faeddf6825824f133831811771b74aff7a4be6c', amount: 64.4, totalInterest: 0.5796, term: 216, health: 45 },
        { loanNumber: '0x7faeddf6825824f133831811771b74aff7a4be6c', amount: 13.85, totalInterest: 0.11064, term: 156, health: 90 },
      ]
    },
    action: {
      label: '3-dot',
      type: 'dropdown',
      items: [
        {
          label: 'Liquidate',
          slot: 'onLiquidatePosition',
          param: { isLend: false },
          enabled: checkLoanCanBeLiquidated,
        },
      ]
    }
  }, {
    title: 'MY BORROW POSITIONS',
    headers: [
      {
        label: 'Loan Number',
        key: 'loanNumber',
        style: { fontFamily: 'Space Mono', width: '100%' }
      }, {
        label: 'Amount',
        key: 'amount',
        precision: 2,
      }, {
        label: 'Total Interest ',
        key: 'totalInterest',
        precision: 5,
      }, {
        label: 'Term',
        key: 'term',
        filter: 'calcTerm',
      }, {
        label: 'Loan Health',
        key: 'health',
        suffix: '%',
      }, {
        label: 'Loan Status',
        key: 'status',
      },
    ],
    data: {
      key: 'borrowed',
      test: [
        { loanNumber: '0x7faeddf6825824f133831811771b74aff7a4be6c', amount: 13.83, totalInterest: 0.11064, term: 156, health: 84 },
        { loanNumber: '0x7faeddf6825824f133831811771b74aff7a4be6c', amount: 64.4, totalInterest: 0.5796, term: 216, health: 45 },
        { loanNumber: '0x7faeddf6825824f133831811771b74aff7a4be6c', amount: 13.85, totalInterest: 0.11064, term: 156, health: 65 },
      ]
    },
    action: {
      label: '3-dot',
      type: 'dropdown',
      items: [
        {
          label: 'Top up collateral',
          slot: 'onTopupWithCollateral',
          param: { isLend: true },
          enabled: checkLoanCanBeClosed,
        }, {
          label: 'Repay Loan',
          slot: 'onRepayLoan',
          param: { isLend: true },
          enabled: checkLoanCanBeClosed,
        }, {
          label: 'Clean Contract',
          slot: 'onCleanContract',
          param: { isLend: true },
          enabled: checkLoanCanBeCleaned,
        },
      ]
    }
  },
])

export default CreateTables
