export function PageLoading({ variant = "site" }: { variant?: "site" | "admin" }) {
  if (variant === "admin") {
    return (
      <div className="page-loading" aria-live="polite" aria-busy="true">
        <div className="page-loading__title" />
        <div className="page-loading__toolbar" />
        <div className="page-loading__table">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="page-loading__row" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-loading page-loading--site" aria-live="polite" aria-busy="true">
      <div className="page-loading__hero" />
      <div className="page-loading__grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="page-loading__card" />
        ))}
      </div>
    </div>
  );
}
