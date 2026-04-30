import styles from './table.module.css';

interface TableProps<T extends object = object> extends React.TableHTMLAttributes<HTMLTableElement> {
	columns: IColumn<T>[];
	data: T[];
}

export interface IColumn<T extends object = object> {
	prop: string;
	label: string;
}

export default function Table({ columns, data, ...rest }: TableProps) {
	const headers = columns.map(column => <th key={column.prop}>{column.label}</th>);
	const items = data.map((row, index) => {
		const cells = columns.map(c => <td key={c.prop}>{row[c.prop]}</td>);
		return <tr key={index}>{cells}</tr>;
	});
	return (
		<table className={styles.grid} style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }} {...rest}>
			<thead>
				<tr>{headers}</tr>
			</thead>
			<tbody>{items}</tbody>
		</table>
	);
}
