import { Check, X } from 'lucide-react'
import './PlanComparison.css'

export type ComparisonCell = boolean | string

export interface ComparisonRow {
  readonly label: string
  readonly values: readonly ComparisonCell[]
}

export interface ComparisonSection {
  readonly title: string
  readonly rows: readonly ComparisonRow[]
}

export interface PlanComparisonContent {
  readonly title: string
  readonly lead: string
  readonly planColumns: readonly string[]
  readonly sections: readonly ComparisonSection[]
  readonly a11y: {
    readonly included: string
    readonly notIncluded: string
  }
}

interface Props {
  content: PlanComparisonContent
}

export function PlanComparison({ content }: Props) {
  const { title, lead, planColumns, sections, a11y } = content
  const colSpan = planColumns.length + 1

  return (
    <section className="plan-comparison" aria-labelledby="plan-comparison-title">
      <div className="plan-comparison__head">
        <h2 id="plan-comparison-title" className="plan-comparison__title">
          {title}
        </h2>
        <p className="plan-comparison__lead">{lead}</p>
      </div>

      <div className="plan-comparison__card">
        <div className="plan-comparison__scroll">
          <table className="plan-comparison__table">
            <thead>
              <tr>
                <th scope="col" className="plan-comparison__row-head" />
                {planColumns.map((label) => (
                  <th key={label} scope="col" className="plan-comparison__col-head">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            {sections.map((section, sIdx) => (
              <tbody key={section.title} className="plan-comparison__section">
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={colSpan}
                    className={`plan-comparison__section-title${
                      sIdx === 0 ? ' plan-comparison__section-title--first' : ''
                    }`}
                  >
                    {section.title}
                  </th>
                </tr>
                {section.rows.map((row) => (
                  <tr key={row.label} className="plan-comparison__row">
                    <th scope="row" className="plan-comparison__row-label">
                      {row.label}
                    </th>
                    {row.values.map((value, i) => (
                      <td key={i} className="plan-comparison__cell">
                        {typeof value === 'boolean' ? (
                          value ? (
                            <Check
                              size={20}
                              strokeWidth={2.5}
                              className="plan-comparison__icon plan-comparison__icon--yes"
                              aria-label={a11y.included}
                            />
                          ) : (
                            <X
                              size={20}
                              strokeWidth={2.5}
                              className="plan-comparison__icon plan-comparison__icon--no"
                              aria-label={a11y.notIncluded}
                            />
                          )
                        ) : (
                          <span className="plan-comparison__cell-text">{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </section>
  )
}
