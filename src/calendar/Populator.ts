// @ts-ignore
import { scale } from '@observablehq/plot';

import type CalHeatmap from '../CalHeatmap';

export default class Populator {
  calendar: CalHeatmap;

  constructor(calendar: CalHeatmap) {
    this.calendar = calendar;
  }

  populate(): void {
    const { calendar } = this;
    const { options } = calendar.options;
    const { DateHelper } = calendar.helpers;

    let colorScale: any = null;
    try {
      const scaleOptions = options.scale;
      colorScale = scale({ [scaleOptions.as]: scaleOptions });
    } catch (error) {
      // Do nothing
    }

    calendar.calendarPainter.root
      .selectAll('.graph-domain')
      .selectAll('svg')
      .selectAll('g')
      .data((d: any) => calendar.domainCollection.get(d) || [])
      .call((element: any) => {
        element
          .select('rect')
          .style('fill', (d: any) => colorScale?.apply(d.v))
          .attr('aria-labelledby', (d: any) => {
            const { title } = options.subDomain;

            return title ? title(d.t, d.v) : null;
          });
      })
      .call((element: any) => {
        element.select('text').text((d: any, i: number, nodes: any) =>
          // eslint-disable-next-line implicit-arrow-linebreak
          DateHelper.format(d.t, options.subDomain.label, d.v, nodes[i]));
      })
      .call(() => {
        this.calendar.eventEmitter.emit('fill');
      });
  }
}