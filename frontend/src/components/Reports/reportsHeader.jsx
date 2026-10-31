
import { useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { setDateRange, setCustomDateRange } from '../../store/reportsSlice';
import Skeleton from '../../components/Skeleton/Skeleton';

export function ReportsHeader({
  dateRange,
  ranges,
  isLoading = false,
  customStartDate = '',
  customEndDate = '',
  onExportPDF = () => {},
  onExportExcel = () => {},
  exportDisabled = false,
}) {
  const dispatch = useDispatch();

  return (
    <div
      style={{
        padding: '36px 15px 28px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 20,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}
    >
      {isLoading ? (
        <>
          {/* Left */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 10,
              }}
            >
              <Skeleton width="34px" height="34px" radius="9px" />

              <Skeleton width="180px" height="30px" />
            </div>

            <Skeleton width="420px" height="16px" />

            <div style={{ marginTop: 8 }}>
              <Skeleton width="320px" height="16px" />
            </div>
          </div>

          {/* Right */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} width="70px" height="34px" radius="8px" />
            ))}

            <Skeleton width="80px" height="36px" radius="8px" />

            <Skeleton width="90px" height="36px" radius="8px" />
          </div>
        </>
      ) : (
        <>
          {/* ---------Original Code ---------- */}

          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  boxShadow: '0 4px 14px rgba(99,102,241,.4)',
                }}
              >
                📊
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                My Reports
              </h1>
            </div>

            <p
              style={{
                margin: 0,
                fontSize: 14,
                maxWidth: 420,
              }}
            >
              Personal attendance, productivity & performance analytics — track
              your progress and celebrate achievements.
            </p>
          </div>

          <motion.div
            layout
            transition={{ layout: { duration: 0.28, ease: 'easeInOut' } }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <motion.div
              layout
              style={{
                display: 'flex',
                borderRadius: 10,
                padding: 3,
                gap: 5,
              }}
            >
              {ranges.map((r) => (
                <button
                  key={r.id}
                  onClick={() => dispatch(setDateRange(r.id))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 7,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 12.5,
                    fontWeight: 500,
                    background: dateRange === r.id ? 'var(--button)' : 'transparent',
                    color: dateRange === r.id ? '#fff' : 'var(--text_primary)',
                  }}
                >
                  {r.label}
                </button>
              ))}
            </motion.div>

            <AnimatePresence initial={false}>
              {dateRange === 'custom' && (
              <motion.div
                key="reports-custom-range"
                className="reports_custom_range_reveal"
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
              <div className="reports_custom_range">
                <label>
                  From
                  <input
                    type="date"
                    value={customStartDate}
                    max={customEndDate || undefined}
                    onChange={(event) =>
                      dispatch(setCustomDateRange({
                        startDate: event.target.value,
                        endDate: customEndDate,
                      }))
                    }
                  />
                </label>
                <label>
                  To
                  <input
                    type="date"
                    value={customEndDate}
                    min={customStartDate || undefined}
                    onChange={(event) =>
                      dispatch(setCustomDateRange({
                        startDate: customStartDate,
                        endDate: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>
              </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              layout
              type="button"
              onClick={onExportPDF}
              disabled={exportDisabled}
              aria-label="Export report as PDF"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 9,
                border: '1px solid rgba(255,255,255,.08)',
                cursor: exportDisabled ? 'not-allowed' : 'pointer',
                opacity: exportDisabled ? 0.55 : 1,
              }}
            >
              📄 PDF
            </motion.button>

            <motion.button
              layout
              type="button"
              onClick={onExportExcel}
              disabled={exportDisabled}
              aria-label="Export report as Excel workbook"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 9,
                border: '1px solid rgba(16,185,129,.2)',
                cursor: exportDisabled ? 'not-allowed' : 'pointer',
                opacity: exportDisabled ? 0.55 : 1,
              }}
            >
              📊 Excel
            </motion.button>
          </motion.div>
        </>
      )}
    </div>
  );
}
