import moment from 'moment'

export function FormInputs(isLend) {
  return [
    {
      key: 'loanAmountOffered',
      label: 'Amount',
      width: 150,
      output: (val) => (val.toString()),
      inputs: [{
        precision: 3,
        suffix: isLend ? 'DAI' : 'DAI',
        unit: 1
      }],
      required: true,
      validation: (contracts, rate = 1) => ((contracts.loanAmountOffered / (isLend ? 1 : rate)) <= (contracts.allowances ? (contracts.allowances[isLend ? 'DAI' : 'WETH'] || 0) : 0))
    }, {
      key: 'interestRatePerDay',
      label: 'Daily Rate',
      width: 150,
      output: (val) => (val.toString()),
      inputs: [{
        precision: 3,
        arrow: true,
        step: 0.1,
        unit: 1
      }],
      required: true
    }, {
      key: 'loanDuration',
      label: 'Length',
      width: 150,
      output: (val) => (val.toString()),
      inputs: [{
        precision: 0,
        arrow: true,
        step: 1,
        suffix: 'd',
        unit: 24 * 3600,
      }, {
        precision: 0,
        arrow: true,
        step: 1,
        suffix: 'h',
        max: 23,
        unit: 1 * 3600
      }],
      required: true
    }, {
      key: 'offerExpiry',
      label: 'Order Expires',
      width: 150,
      output: (val) => {
        let ret = new moment.utc()
        ret.add(val, 'm')
        return ret.format('x')
      },
      inputs: [{
        precision: 0,
        arrow: true,
        step: 1,
        suffix: 'h',
        unit: 60
      }, {
        precision: 0,
        arrow: true,
        step: 1,
        suffix: 'm',
        max: 60,
        unit: 1
      }]
    }, {
      key: 'allowance',
      label: 'Allowance',
      width: 150,
      output: (val) => (val.toString()),
      inputs: [{
        precision: 3,
        suffix: isLend ? 'DAI' : 'WETH',
        unit: 1
      }],
      style: { paddingRight: 8 },
      value: (contracts) => (contracts.allowances ? (contracts.allowances[isLend ? 'DAI' : 'WETH'] || 0) : 0),
      readOnly: true,
      loading: 'allowance'
    },
  ]
}

export const FeeFormInputs = [
  {
    key: 'relayerFeeLST',
    label: 'Relayer Fee',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'LST',
      unit: 1
    }]
  }, {
    key: 'monitoringFeeLST',
    label: 'Monitoring Fee',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'LST',
      unit: 1
    }]
  }, {
    key: 'rolloverFeeLST',
    label: 'RollOver Fee',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'LST',
      unit: 1
    }]
  }, {
    key: 'closureFeeLST',
    label: 'Closure Fee',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'LST',
      unit: 1
    }]
  }
]

export const WrapETHFormInputs = [
  {
    key: 'ETHBalance',
    label: 'ETH Balance',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 5,
      suffix: 'ETH',
      unit: 1
    }],
    readOnly: true,
    value: (contracts) => (contracts.balances ? (contracts.balances.ETH || 0) : 0),
    loading: 'wrapping'
  }, {
    key: 'wETHBalance',
    label: 'WETH Balance',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 5,
      suffix: 'ETH',
      unit: 1
    }],
    readOnly: true,
    value: (contracts) => (contracts.balances ? (contracts.balances.WETH || 0) : 0),
    loading: 'wrapping'
  }, {
    key: 'operation',
    label: 'Operation',
    width: 150,
  }, {
    key: 'amount',
    label: 'Amount',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      suffix: 'ETH',
      unit: 1
    }],
    required: true
  },
]

export const AllowanceFormInputs = [
  {
    key: 'token',
    label: 'Token',
    width: 150,
  }, {
    key: 'tokenBalance',
    label: 'Token Balance',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      unit: 1
    }],
    readOnly: true,
    value: (contracts) => (contracts.balances ? (contracts.balances[contracts.token] || 0) : 0),
    loading: 'wrapping'
  }, {
    key: 'tokenAllowance',
    label: 'Token Allowance',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      unit: 1
    }],
    readOnly: true,
    value: (contracts) => (contracts.allowances ? (contracts.allowances[contracts.token] || 0) : 0),
    loading: 'allowance'
  }, {
    key: 'newAllowance',
    label: 'New Allowance',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      unit: 1
    }],
    required: true
  },
]

export const MakerDAIFormInputs = [
  {
    key: 'ethBalance',
    label: 'ETH Balance',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      unit: 1
    }],
    readOnly: true,
    value: (contracts) => (contracts.balances ? (contracts.balances.ETH || 0) : 0),
    loading: 'making'
  }, {
    key: 'daiBalance',
    label: 'DAI Balance',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      unit: 1
    }],
    readOnly: true,
    value: (contracts) => (contracts.balances ? (contracts.balances.DAI || 0) : 0),
    loading: 'making'
  }, {
    key: 'lockETH',
    label: 'Amount to Lock(ETH)',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      unit: 1
    }],
    required: true,
  }, {
    key: 'amountInDAI',
    label: 'Amount to Buy(DAI)',
    width: 150,
    output: (val) => (val.toString()),
    inputs: [{
      precision: 3,
      unit: 1
    }],
    readOnly: true,
    required: true,
  },
]
