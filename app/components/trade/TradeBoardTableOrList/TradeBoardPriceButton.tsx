import Button, { ButtonElement } from '@lyra/ui/components/Button'
import { IconType } from '@lyra/ui/components/Icon'
import { MarginProps } from '@lyra/ui/types'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Quote, QuoteDisabledReason } from '@lyrafinance/lyra-js'
import React from 'react'

import emptyFunction from '@/app/utils/emptyFunction'

type Props = {
  quote: Quote
  isCall: boolean
  isBuy: boolean
  isSelected: boolean
  onSelected: (isSelected: boolean) => void
  disabledReason?: QuoteDisabledReason | null
} & MarginProps

const getDisabledMessage = (disabledReason: QuoteDisabledReason): string => {
  switch (disabledReason) {
    case QuoteDisabledReason.EmptySize:
    case QuoteDisabledReason.EmptyPremium:
    case QuoteDisabledReason.Expired:
    case QuoteDisabledReason.TradingCutoff:
    case QuoteDisabledReason.InsufficientLiquidity:
    case QuoteDisabledReason.DeltaOutOfRange:
      return 'Disabled'
    case QuoteDisabledReason.VolTooHigh:
    case QuoteDisabledReason.VolTooLow:
    case QuoteDisabledReason.IVTooHigh:
      return 'Buy Only'
    case QuoteDisabledReason.IVTooLow:
    case QuoteDisabledReason.SkewTooHigh:
    case QuoteDisabledReason.SkewTooLow:
      return 'Sell Only'
  }
}

const getIsDisabled = (disabledReason: QuoteDisabledReason): boolean => {
  switch (disabledReason) {
    case QuoteDisabledReason.InsufficientLiquidity:
      return false
    default:
      return true
  }
}

const getButtonWidthForMarket = (marketName: string) => {
  switch (marketName.toLowerCase()) {
    case 'btc':
      return 142
    default:
      return 128
  }
}

export default function TradeBoardPriceButton({
  quote,
  isCall,
  isBuy,
  isSelected,
  disabledReason,
  onSelected = emptyFunction,
  ...styleProps
}: Props): ButtonElement {
  const isDisabled = !!disabledReason && getIsDisabled(disabledReason)
  return (
    <Button
      variant={(isCall && isBuy) || (!isCall && !isBuy) ? 'primary' : 'error'}
      width={getButtonWidthForMarket(quote.marketName)}
      showRightIconSeparator
      isOutline={!isSelected}
      isDisabled={isDisabled}
      label={isDisabled && disabledReason ? getDisabledMessage(disabledReason) : formatUSD(quote.premium)}
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopPropagation()
        onSelected(!isSelected)
      }}
      rightIcon={!isDisabled ? (!isSelected ? IconType.Plus : IconType.Check) : null}
      {...styleProps}
    />
  )
}
