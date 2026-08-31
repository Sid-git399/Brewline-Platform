export default function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <div className="mx-auto max-w-5xl px-4 text-sm text-espresso/70">
        <p>&copy; {new Date().getFullYear()} Brewline. A demo coffee gear shop.</p>
      </div>
    </footer>
  );
}
