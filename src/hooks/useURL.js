import { useSearchParams } from 'react-router-dom';

export function useURL() {
  const [searchParams] = useSearchParams();
  const lat = Number.parseFloat(searchParams.get('lat'));
  const lng = Number.parseFloat(searchParams.get('lng'));
  return [lat, lng];
}
