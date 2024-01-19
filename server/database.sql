-- Creating 'burrito' table
CREATE TABLE burrito (
    burrito_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    size CHAR(2) CHECK (size IN ('S', 'M', 'L', 'XL')) NOT NULL,
    price DECIMAL(5, 2) NOT NULL
);
-- Creating 'order' table
CREATE TABLE order_table (
    order_id SERIAL PRIMARY KEY,
    total_cost DECIMAL(8, 2) NOT NULL
);

-- Creating 'order_item' table with foreign keys to 'order' and 'burrito'
CREATE TABLE order_item (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT,
    burrito_id INT,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES order_table(order_id),
    FOREIGN KEY (burrito_id) REFERENCES burrito(burrito_id)
);
