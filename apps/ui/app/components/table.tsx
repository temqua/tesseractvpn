import { JSX, SetStateAction, useEffect, useMemo } from 'react';
import { Button } from './button';
import { Select } from './select';
import styles from './table.module.css';

interface TableProps<T extends Record<keyof T, React.ReactNode> = object>
	extends React.TableHTMLAttributes<HTMLTableElement> {
	columns: IColumn<T>[];
	data: T[];
	searchRow?: JSX.Element;
	count: number;
	page: number;
	take: number;
	onChangePage?: (page: number | SetStateAction<number>) => void;
	onChangeTake?: (take: number | SetStateAction<number>) => void;
}
export interface IColumn<T extends Record<keyof T, React.ReactNode> = object> {
	prop?: keyof T;
	label: string;
	searchable?: boolean;
	search?: {
		custom?: true;
	};
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
	...rest
}: TableProps<T>) {
	const headers = columns.map((column, i) => <th key={i}>{column.label}</th>);

	const totalPages = useMemo(() => Math.max(1, Math.ceil(count / take)), [count, take]);
	const items = data.map((row, index) => {
		const cells = columns.map((c, ci) => {
			if (c.actions) {
				return <td key={ci}>{c.actions(row)}</td>;
			}

			let cellData = c.prop ? row[c.prop] : '';
			if (c.prop && typeof row[c.prop] === 'boolean') {
				cellData = row[c.prop] ? '✅' : '❌';
			}
			return <td key={ci}>{cellData}</td>;
		});
		return <tr key={index}>{cells}</tr>;
	});

	function handlePreviousPage(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		onChangePage?.(p => Math.max(1, p - 1));
	}

	function handleNextPage(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		onChangePage?.(p => Math.min(totalPages, p + 1));
	}

	return (
		<div className="flex flex-col gap-4">
			<div className={styles['pagination-wrapper']}>
				<div>Count: {count}</div>
				<div className={styles.pagination}>
					{totalPages > 1 ? (
						<>
							<Button onClick={handlePreviousPage} disabled={page === 1}>
								🡰
							</Button>
							<Button onClick={() => onChangePage?.(1)} disabled={page === 1}>
								1
							</Button>

							{/* {totalPages > 2 && <Button onClick={() => onChangePage?.(2)} disabled={page === 2}>
								2
							</Button>} */}

							{totalPages > 2 && page > 2 && <span className="self-center px-2">...</span>}

							{page > 1 && page < totalPages && <Button disabled>{page}</Button>}

							{totalPages > 2 && page < totalPages - 1 && <span className="self-center px-2">...</span>}

							<Button onClick={() => onChangePage?.(totalPages)} disabled={page === totalPages}>
								{totalPages}
							</Button>
							<Button onClick={handleNextPage} disabled={page === totalPages}>
								🡲
							</Button>
						</>
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
			<table className={styles.table} style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }} {...rest}>
				<thead>
					<tr>{headers}</tr>
					<tr>{searchRow}</tr>
				</thead>
				<tbody>{items}</tbody>
			</table>
		</div>
	);
}
