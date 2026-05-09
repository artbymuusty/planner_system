'use client';

interface Props {
  title: string;
}

export default function AppHeader({ title }: Props) {
  return (
    <header className="app-header">
      <h1 className="app-title">{title}</h1>
    </header>
  );
}
