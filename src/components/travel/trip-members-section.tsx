import { AddTripMemberForm } from "~/components/travel/add-trip-member-form";

export type TripMemberRow = {
  userId: string;
  role: "owner" | "member";
  displayName: string;
};

type Props = {
  tripId: string;
  members: TripMemberRow[];
  isOwner: boolean;
};

export function TripMembersSection({ tripId, members, isOwner }: Props) {
  return (
    <section className="rounded-2xl border-2 border-primary/10 bg-card p-5 shadow-md">
      <h2 className="font-display text-xl font-bold text-foreground">
        Who&apos;s on this trip
      </h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Owners can invite more people by the Google email they use to sign in.
      </p>
      <ul className="mt-4 space-y-2">
        {members.map((m) => (
          <li
            key={m.userId}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/50 px-3 py-2 text-sm"
          >
            <span className="font-medium text-foreground">{m.displayName}</span>
            <span className="text-muted-foreground capitalize">{m.role}</span>
          </li>
        ))}
      </ul>
      {isOwner ? <AddTripMemberForm tripId={tripId} /> : null}
    </section>
  );
}
