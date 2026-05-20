import { JSX } from 'react';
import styles from './table.module.css';

interface TableProps<T extends Record<keyof T, React.ReactNode> = object>
	extends React.TableHTMLAttributes<HTMLTableElement> {
	columns: IColumn<T>[];
	data: T[];
	searchRow?: JSX.Element;
}

export interface IColumn<T extends Record<keyof T, React.ReactNode> = object> {
	prop?: keyof T;
	label: string;
	searchable?: boolean;
	actions?: (row: T) => React.ReactNode;
}

export default function Table<T extends Record<keyof T, React.ReactNode> = Record<string, React.ReactNode>>({
	columns,
	data,
	searchRow,
	...rest
}: TableProps<T>) {
	const headers = columns.map((column, i) => <th key={i}>{column.label}</th>);

	const items = data.map((row, index) => {
		const cells = columns.map((c, ci) => {
			if (c.actions) {
				return <td key={ci}>{c.actions(row)}</td>;
			}
			return <td key={ci}>{c.prop ? row[c.prop] : ''}</td>;
		});
		return <tr key={index}>{cells}</tr>;
	});
	return (
		<table className={styles.grid} style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }} {...rest}>
			<thead>
				<tr>{headers}</tr>
				<tr>{searchRow}</tr>
			</thead>
			<tbody>{items}</tbody>
		</table>
	);
}
