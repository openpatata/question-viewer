
import * as d3 from 'd3'
import React from 'react'


const days = ['Κυρ', 'Δευ', 'Τρί', 'Τετ', 'Πέμ', 'Παρ', 'Σάβ']
const months = ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μαΐ', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ']
d3.timeFormatDefaultLocale({
  date: '%d/%m/%y', time: '%H:%M:%S', days: days, periods: ['π.μ.', 'μ.μ.'],
  shortDays: days, months: months, shortMonths: months
})

export const TimeSeries = React.createClass({
  shouldComponentUpdate(props) {
    const margin = {top: 10, right: 0, bottom: 30, left: 0},
      width = 590 - margin.left - margin.right,
      height = 180 - margin.top - margin.bottom

    const questionDates = props.questionDates.map(i => new Date(i.date))
    const formatCount = d3.format(",.0f")

    const x = d3.scaleTime()
      .domain(d3.extent(questionDates))
      .range([0, width])
    const y = d3.scaleLinear()
      .range([height, 0])
    const histogram = d3.histogram()
      .domain(x.domain()).thresholds(x.ticks(d3.timeYear))
    const bins = histogram(questionDates)
    y.domain([0, d3.max(bins, d => d.length)])

    d3.select(this.refs.chart).select('svg').remove()

    const svg = d3.select(this.refs.chart)
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
      .text(d => formatCount(d.length))

    return false
  },

  render() {
    return <div className="time-series" ref="chart"/>
  }
})