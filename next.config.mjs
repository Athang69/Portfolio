/** @type {import('next').NextConfig} */
const nextConfig = {
  // Type errors used to be ignored here. The project typechecks clean and CI
  // runs tsc on every push, so a broken type should fail the build.
  images: {
    unoptimized: true,
  },
}

export default nextConfig
