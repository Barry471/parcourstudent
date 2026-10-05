export function StepMenu({ steps }: { steps: { id: string; title: string }[] }) {
  return (
    <nav aria-label="Étapes" className="sticky top-0 z-20 -mx-5 mt-6 border-b border-line bg-paper/95 px-5 py-2 backdrop-blur">
      <ul className="flex gap-2 overflow-x-auto">
        {steps.map((step, index) => (
          <li key={step.id} className="shrink-0">
            <a href={`#etape-${step.id}`} className="inline-flex max-w-44 items-center gap-2 rounded-full border border-line bg-card px-3 py-2 text-sm">
              <span className="font-medium text-blue">{index + 1}</span>
              <span className="truncate">{step.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
