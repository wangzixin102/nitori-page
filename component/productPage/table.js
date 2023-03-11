import styles from './table.module.css';

function Table({ data }) {
    return (
      <table className={styles.table}>
        <tbody>
          {Object.entries(data).map(([name, value]) => (
            <tr key={name}>
              <td className={styles.tableName}>{name}</td>
              <td className={styles.tableValue}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  
  export default Table;
  