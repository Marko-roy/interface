import Box from '@lyra/ui/components/Box'
import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import { ToggleButtonItemProps } from '@lyra/ui/components/Button/ToggleButton'
import Card, { CardElement } from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import { Option } from '@lyrafinance/lyra-js'
import React, { useCallback, useMemo, useState } from 'react'

import ChartPeriodSelector from '@/app/components/common/ChartPeriodSelector'
import { ChartPeriod } from '@/app/constants/chart'

import SpotPriceChart from '../../common/SpotPriceChart'
import SpotPriceCardTitle from '../../common/SpotPriceChartTitle'
import PositionIVChart from './PositionIVChart'
import PositionIVChartTitle from './PositionIVChartTitle'
import PositionPriceChart from './PositionPriceChart'
import PositionPriceChartTitle from './PositionPriceChartTitle'

type Props = {
  option: Option
} & MarginProps

enum PositionChart {
  OptionPrice = 'OptionPrice',
  ImpliedVolatility = 'ImpliedVolatility',
  SpotPrice = 'SpotPrice',
}

const CHARTS: ToggleButtonItemProps<PositionChart>[] = [
  {
    id: PositionChart.OptionPrice,
    label: 'Option Price',
  },
  {
    id: PositionChart.ImpliedVolatility,
    label: 'Implied Volatility',
  },
  {
    id: PositionChart.SpotPrice,
    label: 'Spot Price',
  },
]

const PositionChartCard = ({ option, ...marginProps }: Props): CardElement => {
  const [period, setPeriod] = useState(ChartPeriod.OneDay)
  const [hoverOptionPrice, setHoverOptionPrice] = useState<number | null>(null)
  const [hoverImpliedVolatility, setHoverImpliedVolatility] = useState<number | null>(null)
  const [hoverSpotPrice, setHoverSpotPrice] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const onClose = useCallback(() => setIsOpen(false), [])
  const [chart, setChart] = useState(PositionChart.OptionPrice)
  const chartName = useMemo(() => CHARTS.find(c => c.id === chart), [chart])?.label ?? ''
  const isMobile = useIsMobile()

  const titleComponent = (
    <Box>
      <DropdownButton
        ml={-3}
        isTransparent
        label={chartName}
        isOpen={isOpen}
        onClose={onClose}
        textVariant="heading"
        onClick={() => setIsOpen(true)}
      >
        {CHARTS.map(({ id, label }) => (
          <DropdownButtonListItem
            key={id}
            isSelected={id === chart}
            label={label}
            onClick={() => {
              setChart(id)
              onClose()
            }}
          />
        ))}
      </DropdownButton>
      {chart === PositionChart.OptionPrice ? (
        <PositionPriceChartTitle option={option} period={period} hoverOptionPrice={hoverOptionPrice} />
      ) : chart === PositionChart.ImpliedVolatility ? (
        <PositionIVChartTitle
          strike={option.strike()}
          period={period}
          hoverImpliedVolatility={hoverImpliedVolatility}
        />
      ) : chart === PositionChart.SpotPrice ? (
        <SpotPriceCardTitle
          textVariant="heading"
          marketAddressOrName={option.market().address}
          period={period}
          hoverSpotPrice={hoverSpotPrice}
        />
      ) : null}
    </Box>
  )

  const chartComponent =
    chart === PositionChart.OptionPrice ? (
      <PositionPriceChart
        option={option}
        height={[120, 170]}
        period={period}
        hoverOptionPrice={hoverOptionPrice}
        onHover={setHoverOptionPrice}
      />
    ) : chart === PositionChart.ImpliedVolatility ? (
      <PositionIVChart
        strike={option.strike()}
        height={[120, 170]}
        period={period}
        hoverImpliedVolatility={hoverImpliedVolatility}
        onHover={setHoverImpliedVolatility}
      />
    ) : chart === PositionChart.SpotPrice ? (
      <SpotPriceChart
        marketAddressOrName={option.market().address}
        height={[120, 170]}
        period={period}
        hoverSpotPrice={hoverSpotPrice}
        onHover={setHoverSpotPrice}
      />
    ) : null

  if (!isMobile) {
    return (
      <Card {...marginProps}>
        <CardBody>
          <Flex>
            {titleComponent}
            <ChartPeriodSelector ml="auto" period={period} onChangePeriod={setPeriod} />
          </Flex>
          {chartComponent}
        </CardBody>
      </Card>
    )
  } else {
    return (
      <Card {...marginProps}>
        <CardBody>
          {titleComponent}
          {chartComponent}
          <ChartPeriodSelector period={period} onChangePeriod={setPeriod} />
        </CardBody>
      </Card>
    )
  }
}

export default PositionChartCard
