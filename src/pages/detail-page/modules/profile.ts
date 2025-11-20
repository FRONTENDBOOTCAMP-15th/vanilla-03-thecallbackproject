export function getProfileImage(src?: string) {
  if (!src || src.trim() === '') {
    return './../../../icons/logo.svg';
  }
  return src;
}
