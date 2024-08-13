export default function Header() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <h1 className="text-4xl lg:text-6xl font-bold">MatchZone</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        The fastest way to schedule tennis and paddel matches
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
