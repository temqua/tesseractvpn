import UsersClientSide from '@/features/users/components/all';
import { usersSSRClient } from '@/features/users/lib/ssr-client';

export default async function UsersPage() {
	// const { error, data } = useSuspenseQuery({
	// 	queryKey: ['users-all'],
	// 	queryFn: () => usersClient.getAll(),
	// });
	const response = await usersSSRClient.getAll({
		skip: 0,
		take: 25,
	});
	return <UsersClientSide data={response.data} count={response.count}></UsersClientSide>;
}
