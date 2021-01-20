const icons = {
  chevron: props => (
    <svg width="8" height="8" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M3.646 6.354l-3-3 .708-.708L4 5.293l2.646-2.647.708.708-3 3L4 6.707l-.354-.353z"
      />
    </svg>
  ),
  check: props => (
    <svg width="16" height="16" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M13.207 5.207l-5.5 5.5-.707.707-.707-.707-3-3 1.414-1.414L7 8.586l4.793-4.793 1.414 1.414z"
      />
    </svg>
  ),
  rotateX: props => (
    <svg width="16" height="16" fill="none" {...props}>
      <path
        stroke="currentColor"
        d="M5 8c0 3.314 1.343 6 3 6s3-2.686 3-6-1.343-6-3-6C6.89 2 5.92 3.207 5.401 5M5 8l-2 2.5M5 8l2.5 2"
      />
    </svg>
  ),
  rotateY: props => (
    <svg width="16" height="16" fill="none" {...props}>
      <path
        stroke="currentColor"
        d="M8 5C4.686 5 2 6.343 2 8s2.686 3 6 3 6-1.343 6-3c0-1.11-1.207-2.08-3-2.599M8 5L5.5 3M8 5L6 7.5"
      />
    </svg>
  ),
  rotateZ: props => (
    <svg width="16" height="16" fill="none" {...props}>
      <path stroke="currentColor" d="M8 3a5 5 0 102.5.669M8 3L5.5 1.5M8 3L6.5 5.5" />
    </svg>
  ),
};

export default icons;
