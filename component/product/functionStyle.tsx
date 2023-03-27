import { useState, Dispatch, SetStateAction } from 'react';
import styles from './functionStyle.module.css';

interface PropertyValue {
    value: string;
    count: number;
}

interface Props {
    sku: any[];
    onSelectedValuesChange: (newValues: {[key: string]: string[]}) => void;
    initialSelectedValues: { [key: string]: string[] };
}
  
const FunctionStyle: React.FC<Props> = (
    { sku, initialSelectedValues, onSelectedValuesChange }
) => {    
    const [selectedValues, setSelectedValues] = useState<{[key: string]: string[]}>(
        initialSelectedValues
    );
    const uniqueProperties = sku.reduce((
        acc: { [key: string]: { [value: string]: Set<string> } },
        obj: { [key: string]: any }
    ) => {
        Object.entries(obj).forEach(([key, value]) => {
            if (key === "product_id") return;
            const prefix = key.split("_")[0].replace(/\d+/, "");
            const prop = acc[prefix] || {};
            const val = value.toString();
            prop[val] = new Set([...(prop[val] || []), obj.product_id]);
            acc[prefix] = prop;
        });
        return acc;
    }, {});
  
    const propertiesList = Object.entries(uniqueProperties).map(([key, values]) => {
        const uniqueValues = Object.entries(values)
            .filter(([value, productIds]) => productIds.size > 0)
            .map(([value, productIds]) => ({
                value,
                count: productIds.size,
            }));
        return {
            name: key,
            values: uniqueValues,
        };
    });

    const handleValueChange = (propertyName: string, value: string) => {
        setSelectedValues((prevValues) => {
            const selectedValuesForProperty = prevValues[propertyName] || [];
            if (selectedValuesForProperty.includes(value)) {
                const newValues = {
                    ...prevValues,
                    [propertyName]: selectedValuesForProperty.filter((v: string) => v !== value),
                };
                onSelectedValuesChange(newValues);
                return newValues;
            } else {
                const newValues = {
                    ...prevValues,
                    [propertyName]: [...selectedValuesForProperty, value],
                };
                onSelectedValuesChange(newValues);
                return newValues;
            }
        });
      };
      
      const clearOne = (key: string, value: string) => {
        setSelectedValues((prevValues) => {
            const newValues = {
                ...prevValues,
                [key]: prevValues[key].filter((val) => val !== value),
            };
            onSelectedValuesChange(newValues);
            return newValues;
        });
      };

    const clearAll = () => { setSelectedValues({}) };

    return (
        <div className={styles.mainContainer}>
            <h3 className={styles.filterTitle}>条件で絞り込む</h3>
            <div className={styles.currentFilterContainer}>
                <h4 className={styles.currentFilter}>現在絞り込んでいる条件</h4>
                {Object.entries(selectedValues).map(([key, values]) => (
                    <div key={key} className={styles.option}>
                        {values.map((value) => (
                            <span 
                                key={`${key}-${value}`} 
                                className={styles.filterValue}
                                onClick={() => clearOne(key, value)}
                            >
                                {value}
                            </span>
                        ))}
                    </div>
                ))}
                <button 
                    className={styles.clearAllBtn} 
                    onClick={clearAll}
                    disabled={!Object.values(selectedValues).some((values) => values.length)}
                >
                    全条件をクリア
                </button>
            </div>
            
            {propertiesList.map((property) => (
                <div key={property.name} className={styles.propContainer}>
                    <h4 className={styles.propName}>
                        {property.name.replace(/_\d+/, "").replace(/_/g, " ")}
                    </h4>
                    {property.values.map((value: PropertyValue) => (
                        <div className={styles.propWrapper}>
                            <input
                                type="checkbox"
                                className={styles.propCheckBox}
                                checked={
                                    (selectedValues[property.name] || []).includes(value.value)
                                }
                                onChange={() => handleValueChange(property.name, value.value)}
                            />                
                            <p key={value.value} className={styles.propValue}>
                                {value.value}  ({value.count})
                            </p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default FunctionStyle;
    
