import PlanClientSide from '@/features/plans/components/form';
import { plansSSRClient } from '@/features/plans/lib/ssr-client';
export default async function PlanPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const data = await plansSSRClient.getById(id);
	return <PlanClientSide data={data} id={id} />;
}
