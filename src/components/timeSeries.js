
import * as d3 from 'd3'
import React from 'react'


const days = ['Κυρ', 'Δευ', 'Τρί', 'Τετ', 'Πέμ', 'Παρ', 'Σάβ']
const months = ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μαΐ', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ']

d3.timeFormatDefaultLocale({
  date: '%d/%m/%y', time: '%H:%M:%S', dateTime: '%A, %e %B',
  days: days, periods: ['π.μ.', 'μ.μ.'],
  shortDays: days, months: months, shortMonths: months
})

const margin = {top: 10, right: 0, bottom: 30, left: 0}
const width = 590 - margin.left - margin.right
const height = 180 - margin.top - margin.bottom

function selectInterval(dateDiff) {
  if (dateDiff < (31622400000 * 1.5)) {
    return d3.timeMonth
  } else if (dateDiff < (2592000000 * 1.5)) {
    return d3.timeWeek
  } else {
    return d3.timeYear
  }
}

function drawChart(chart, questionDates) {
  if (!questionDates) return

  const data = questionDates.map(i => new Date(i.date))
  const [xMin, xMax] = d3.extent(data)

  const x = d3.scaleTime()
    .domain([xMin, xMax])
    .range([0, width])
  const y = d3.scaleLinear()
    .range([height, 0])
  const bins = d3.histogram()
    .domain(x.domain())
    .thresholds(x.ticks(selectInterval(xMax - xMin)))(data)
  y.domain([0, d3.max(bins, d => d.length)])

  d3.select(chart).select('svg').remove()

  const svg = d3.select(chart)
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
  svg.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(d3.axisBottom(x))

  const bar = svg.selectAll('.bar')
    .data(bins)
    .enter()
      .append('g')
        .attr('class', 'bar')
        .attr('transform', d => `translate(${x(d.x0)}, ${y(d.length)})`)
  bar.append('rect')
    .attr('x', 1)
    .attr('width', d => x(d.x1) - x(d.x0) - 1)
    .attr('height', d => height - y(d.length))
  bar.append('text')
    .attr('dy', '.75em')
    .attr('y', 6)
    .attr('x', d => (x(d.x1) - x(d.x0)) / 2)
    .attr('text-anchor', 'middle')
    .text(d => d.length)
}

export const TimeSeries = React.createClass({
  componentDidMount() {
    drawChart(this.refs.chart, this.props.questionDates)
  },

  shouldComponentUpdate(props) {
    drawChart(this.refs.chart, props.questionDates)
    return false
  },

  render() {
    return <div className="time-series" ref="chart"/>
  }
})
