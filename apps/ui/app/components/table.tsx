import { JSX, useEffect } from 'react';
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
	onChangePage?: (page: number | ((prevState: number) => number)) => void;
	onChangeTake?: (take: number | ((prevState: number) => number)) => void;
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

	const totalPages = Math.max(1, Math.ceil(count / take));
	const items = data.map((row, index) => {
		const cells = columns.map((c, ci) => {
			if (c.actions) {
				return <td key={ci}>{c.actions(row)}</td>;
			}
			return <td key={ci}>{c.prop ? row[c.prop] : ''}</td>;
		});
		return <tr key={index}>{cells}</tr>;
	});

	function handlePreviousPage(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		onChangePage?.(p => Math.max(1, p - 1));
	}

	function handleNextPage(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		onChangePage?.(p => Math.min(totalPages, p + 1));
	}

	useEffect(() => {
		onChangePage?.(page);
	}, [page, onChangePage]);

	useEffect(() => {
		onChangePage?.(1);
	}, [take]);

	useEffect(() => {
		if (page > totalPages) {
			onChangePage?.(totalPages);
		}
	}, [page, totalPages]);
	return (
		<div className="flex flex-col">
			<div className="pagination">
				<div className="flex">
					{totalPages > 1 ? (
						<>
							<Button
								onClick={() => {
									onChangePage?.(1);
								}}
							>
								1
							</Button>
							<Button
								onClick={() => {
									onChangePage?.(totalPages);
								}}
							>
								{totalPages}
							</Button>
							<Button onClick={handlePreviousPage}>🡰</Button>
							<Button onClick={handleNextPage}>🡲</Button>
						</>
					) : (
						''
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
			<table className={styles.grid} style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }} {...rest}>
				<thead>
					<tr>{headers}</tr>
					<tr>{searchRow}</tr>
				</thead>
				<tbody>{items}</tbody>
			</table>
		</div>
	);
}
