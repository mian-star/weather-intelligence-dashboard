import { CloudOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState';

export function NotFoundPage() {
  return (
    <EmptyState
      icon={CloudOff}
      title="Page not found"
      hint="That route does not exist."
      action={
        <Link
          to="/weather"
          className="text-sm font-semibold text-brand hover:text-brand-strong"
        >
          Back to the dashboard
        </Link>
      }
    />
  );
}
