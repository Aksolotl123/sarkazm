export type Route =
  | { name: 'home' }
  | { name: 'lekcja'; id: string }
  | { name: 'quiz'; id: string }
  | { name: 'trening' };

const HOME: Route = { name: 'home' };

/** `#/lekcja/abc` -> { name: 'lekcja', id: 'abc' }. Nieznane ścieżki prowadzą na stronę główną. */
export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#/, '').replace(/^\/+/, '').replace(/\/+$/, '');
  if (path === '') return HOME;
  const [head, ...rest] = path.split('/');
  const id = rest.join('/');
  switch (head) {
    case 'lekcja':
      return id ? { name: 'lekcja', id: safeDecode(id) } : HOME;
    case 'quiz':
      return id ? { name: 'quiz', id: safeDecode(id) } : HOME;
    case 'trening':
      return { name: 'trening' };
    default:
      return HOME;
  }
}

export function routeToHash(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/';
    case 'lekcja':
      return `#/lekcja/${encodeURIComponent(route.id)}`;
    case 'quiz':
      return `#/quiz/${encodeURIComponent(route.id)}`;
    case 'trening':
      return '#/trening';
  }
}

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    // Zniekształcony URL (np. samotny „%”): zostawiamy surowy tekst, dalej i tak nie znajdzie modułu.
    return s;
  }
}
