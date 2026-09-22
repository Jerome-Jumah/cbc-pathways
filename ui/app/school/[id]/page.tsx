import { notFound, permanentRedirect } from "next/navigation";
import { getSchoolProfileById } from "@/lib/api/server";
import { getSchoolUrl } from "@/lib/routes";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LegacySchoolRedirectPage({ params }: Props) {
  const { id } = await params;
  const data = await getSchoolProfileById(id);

  if (!data?.school) {
    notFound();
    return null;
  }

  const { school } = data;
  if (!school.slug) {
    throw new Error(
      `Data integrity error: School ${school.id} does not have a canonical slug.`
    );
  }

  // HTTP 308 permanent redirect to the canonical slug URL
  permanentRedirect(getSchoolUrl(school));
}
