type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="space-y-2 pb-8 pt-4">
      <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground">
        {title}
      </h1>
      {description ? (
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </header>
  );
}
