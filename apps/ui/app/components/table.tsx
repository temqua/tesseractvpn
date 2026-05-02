import { JSX } from 'react';
import styles from './table.module.css';

interface TableProps<T extends object = object> extends React.TableHTMLAttributes<HTMLTableElement> {
	columns: IColumn<T>[];
	data: T[];
	searchRow?: JSX.Element;
}

export interface IColumn<T extends object = object> {
	prop?: string;
	label: string;
	searchable?: boolean;
	actions?: (row: T) => React.ReactNode;
}

export default function Table<T extends object = object>({ columns, data, searchRow, ...rest }: TableProps<T>) {
	const headers = columns.map((column, i) => <th key={i}>{column.label}</th>);

	const items = data.map((row, index) => {
		const cells = columns.map((c, ci) => {
			if (c.actions) {
				return <td key={ci}>{c.actions(row)}</td>;
			}
			return <td key={ci}>{row[c.prop]}</td>;
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
