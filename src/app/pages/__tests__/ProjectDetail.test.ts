import { createElement } from 'react'
import { describe, expect, test } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router'
import { renderToStaticMarkup } from 'react-dom/server'
import { ProjectDetail } from '../ProjectDetail'

function renderProjectDetailMarkup(path = '/projects/1') {
  return renderToStaticMarkup(
    createElement(
      MemoryRouter,
      { initialEntries: [path] },
      createElement(
        Routes,
        null,
        createElement(Route, {
          path: '/projects/:id',
          element: createElement(ProjectDetail),
        }),
      ),
    ),
  )
}

describe('ProjectDetail summary card navigation', () => {
  test('交付进度卡输出进入甘特图页的链接', () => {
    const markup = renderProjectDetailMarkup()

    expect(markup).toContain('/projects/1/delivery')
    expect(markup).toContain('交付进度')
  })

  test('只有交付进度卡带甘特图页面链接', () => {
    const markup = renderProjectDetailMarkup()
    const deliveryLinks = markup.match(/\/projects\/1\/delivery/g) ?? []

    expect(deliveryLinks).toHaveLength(1)
    expect(markup).toContain('负责人')
    expect(markup).toContain('交付时间')
    expect(markup).toContain('总工时')
  })

  test('甘特图链接包裹的是交付进度卡而不是其他摘要卡', () => {
    const markup = renderProjectDetailMarkup()
    const deliveryLinkMatch = markup.match(
      /<a[^>]*href="\/projects\/1\/delivery"[^>]*>([\s\S]*?)<\/a>/,
    )

    expect(deliveryLinkMatch?.[1]).toContain('交付进度')
    expect(deliveryLinkMatch?.[1]).not.toContain('负责人')
    expect(deliveryLinkMatch?.[1]).not.toContain('交付时间')
    expect(deliveryLinkMatch?.[1]).not.toContain('总工时')
  })
})
