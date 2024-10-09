import type { RouteFn } from "faster";

export interface BackendComponent {
  before?: RouteFn[];
  after?: (props: Record<string, unknown>) => void | Promise<void>;
}
