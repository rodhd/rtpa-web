export default async function CourtPage({ params }: { params: { clubId: string, courtId: string } }) {
    const { clubId, courtId } = await params;
    return <div>CourtPage {courtId}</div>;
}