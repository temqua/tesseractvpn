import { ArrowUpDown, Check, X } from 'lucide-react';
import { JSX, SetStateAction, useMemo } from 'react';
import { Button } from './button';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from './pagination';
import { Select } from './select';
import styles from './table.module.css';
import { TableBody, TableHead, TableHeader, TableRow } from './table-components';

interface TableProps<T extends Record<keyof T, React.ReactNode> = object>
	extends React.TableHTMLAttributes<HTMLTableElement> {
	columns: IColumn<T>[];
	data: T[];
	searchRow?: JSX.Element;
	count: number;
	page: number;
	take: number;
	loading?: boolean;
	onChangePage?: (page: number | SetStateAction<number>) => void;
	onChangeTake?: (take: number | SetStateAction<number>) => void;
	onSort?: (prop?: keyof T) => void;
}
export interface IColumn<T extends Record<keyof T, React.ReactNode> = object> {
	prop?: keyof T;
	label: string;
	searchable?: boolean;
	search?: {
		custom?: true;
	};
	sortable?: boolean;
	actions?: (row: T) => React.ReactNode;
}

export default function Table<T extends Record<keyof T, React.ReactNode> = Record<string, React.ReactNode>>({
	columns,
	data,
	searchRow,
	count,
	page,
	take,
	onChangePage,
	onChangeTake,
	onSort,
	loading = false,
	...rest
}: TableProps<T>) {
	const headers = columns.map((column, i) => (
		<TableHead key={i}>
			{column.sortable ? (
				<Button
					variant="ghost"
					onClick={() => {
						onSort?.(column.prop);
					}}
				>
					{column.label}
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			) : (
				<>{column.label}</>
			)}
		</TableHead>
	));

	const totalPages = useMemo(() => Math.max(1, Math.ceil(count / take)), [count, take]);
	const items = data.map((row, index) => {
		const cells = columns.map((c, ci) => {
			if (c.actions) {
				return <td key={ci}>{c.actions(row)}</td>;
			}

			const cellData = c.prop ? row[c.prop] : '';
			if (c.prop && typeof row[c.prop] === 'boolean') {
				return <td key={ci}>{row[c.prop] ? <Check /> : <X />}</td>;
			}
			return <td key={ci}>{cellData}</td>;
		});
		return <tr key={index}>{cells}</tr>;
	});

	function handlePreviousPage(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
		onChangePage?.(p => Math.max(1, p - 1));
	}

	function handleNextPage(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
		onChangePage?.(p => Math.min(totalPages, p + 1));
	}

	if (loading) {
		return 'Loading...';
	}

	return (
		<div>
			<div className={styles.paginationWrapper}>
				<div>Count: {count}</div>
				<div className={styles.pagination}>
					{totalPages > 1 ? (
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious onClick={handlePreviousPage} disabled={page === 1} />
								</PaginationItem>
								{/* <Button onClick={handlePreviousPage} disabled={page === 1}>
									🡰
								</Button> */}
								<PaginationItem>
									<Button onClick={() => onChangePage?.(1)} disabled={page === 1}>
										1
									</Button>
								</PaginationItem>

								{/* {totalPages > 2 && <Button onClick={() => onChangePage?.(2)} disabled={page === 2}>
								2
							</Button>} */}

								{totalPages > 2 && page > 2 && <span className="self-center px-2">...</span>}

								{page > 1 && page < totalPages && <Button disabled>{page}</Button>}

								{totalPages > 2 && page < totalPages - 1 && (
									<span className="self-center px-2">...</span>
								)}

								<PaginationItem>
									<Button onClick={() => onChangePage?.(totalPages)} disabled={page === totalPages}>
										{totalPages}
									</Button>
								</PaginationItem>

								{/* <Button onClick={handleNextPage} disabled={page === totalPages}>
									🡲
								</Button> */}

								<PaginationItem>
									<PaginationNext onClick={handleNextPage} disabled={page === totalPages} />
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					) : (
						<Button disabled>1</Button>
					)}
				</div>
				<div>
					<Select value={take} onChange={event => onChangeTake?.(Number(event.target.value))}>
						<option value="25">25</option>
						<option value="50">50</option>
						<option value="100">100</option>
					</Select>
				</div>
			</div>
			<div className={styles.tableWrapper}>
				<table
					className={styles.table}
					style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
					{...rest}
				>
					<TableHeader>
						<TableRow>{headers}</TableRow>
						<TableRow>{searchRow}</TableRow>
					</TableHeader>
					<TableBody>{items}</TableBody>
				</table>
			</div>
		</div>
	);
}
