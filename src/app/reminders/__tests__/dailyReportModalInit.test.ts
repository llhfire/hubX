import { createElement } from 'react'
import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { SalesDailyTemplate } from '@/app/pages/daily-report/SalesDailyTemplate'
import { GeneralDailyTemplate } from '@/app/pages/daily-report/GeneralDailyTemplate'

function renderSalesFirstFrame() {
  return renderToStaticMarkup(
    createElement(SalesDailyTemplate, {
      userId: 'user-sales-zhangsan',
      date: new Date('2026-05-22T09:00:00.000Z'),
      onChange: () => {},
    }),
  )
}

function renderGeneralFirstFrame() {
  return renderToStaticMarkup(
    createElement(GeneralDailyTemplate, {
      onChange: () => {},
    }),
  )
}

describe('daily report modal initial frame', () => {
  test('sales 首帧应直接包含默认线索数据且不显示空状态', () => {
    const markup = renderSalesFirstFrame()

    expect(markup).toContain('阿里巴巴-企业管理系统')
    expect(markup).toContain('腾讯-云服务平台')
    expect(markup).not.toContain('今日暂无线索跟进记录')
  })

  test('general 首帧应直接包含基础结构', () => {
    const markup = renderGeneralFirstFrame()

    expect(markup).toContain('项目任务')
    expect(markup).toContain('添加项目任务')
    expect(markup).toContain('今日总结')
  })

  test('sales/general 首帧切换时 general 不应残留 sales 线索文案', () => {
    renderSalesFirstFrame()
    const generalMarkup = renderGeneralFirstFrame()

    expect(generalMarkup).not.toContain('阿里巴巴-企业管理系统')
  })
})
