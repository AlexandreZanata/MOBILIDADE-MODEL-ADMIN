import { http, HttpResponse } from "msw";
import { resolveApiBase } from "@/lib/apiBase";
import { passengerFixtures } from "@/test/fixtures/passengers";

export const adminPassengersHandlers = [
  http.get(`${resolveApiBase()}/v1/admin/passengers`, () => {
    return HttpResponse.json({
      items: passengerFixtures,
      nextCursor: null,
      prevCursor: null,
      hasMore: false,
      totalCount: passengerFixtures.length,
    });
  }),

  http.delete(
    `${resolveApiBase()}/v1/admin/passengers/:passengerId`,
    () => {
      return HttpResponse.json({ message: "Passenger deleted successfully." });
    }
  ),

  http.post(
    `${resolveApiBase()}/v1/admin/passengers/:passengerId/reactivate`,
    () => {
      return HttpResponse.json({ message: "Passenger reactivated successfully." });
    }
  ),
];
