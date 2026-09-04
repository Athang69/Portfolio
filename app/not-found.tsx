import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex h-dvh flex-col items-center justify-center bg-bg px-6 text-center">
      <p className="text-[12px] text-gcm">// 404</p>

      <h1 className="display mt-5 text-[clamp(2.4rem,7vw,4rem)] text-bright">File not found</h1>

      <p className="mt-4 max-w-[46ch] text-[13px] leading-relaxed text-text/85">
        That path is not in this workspace. Nothing is broken, the file simply does not exist.
      </p>

      <pre className="mt-8 rounded border border-line bg-bg2/60 px-5 py-3 text-left text-[12px] text-dim">
        <span className="text-green">athang@portfolio</span>
        <span className="text-dim">:</span>
        <span className="text-blue">~</span>
        <span className="text-dim">$ </span>
        cat that-file
        {'\n'}
        <span className="text-red">cat: that-file: No such file or directory</span>
      </pre>

      <Link
        href="/"
        className="mt-10 text-[12.5px] text-accent underline decoration-line underline-offset-[6px] transition hover:text-bright hover:decoration-accent"
      >
        Back to the editor
      </Link>
    </main>
  )
}
