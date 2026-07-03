/** Decorative mosque silhouette for the hero — matches app prayer-times hero motif. */
export function MosqueSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      role="presentation"
      viewBox="0 0 400 120"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.15"
        d="M200 8c-8 0-14 6-14 14v12h-28c-6 0-10 4-10 10v8H80c-4 0-8 4-8 8v72h240V62c0-4-4-8-8-8h-68v-8c0-6-4-10-10-10h-28V22c0-8-6-14-14-14zm-60 54h120v52H140V62z"
      />
      <ellipse cx="200" cy="18" rx="6" ry="8" opacity="0.2" />
      <path opacity="0.08" d="M0 114h400v6H0z" />
    </svg>
  );
}
