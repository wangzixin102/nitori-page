-- CreateTable
CREATE TABLE `recommendation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NULL,
    `itemName` VARCHAR(30) NULL,
    `price` VARCHAR(20) NULL,
    `rank` DECIMAL(3, 2) NULL,
    `review` DECIMAL(7, 0) NULL,
    `imgUrl` VARCHAR(200) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(20) NOT NULL,
    `email` VARCHAR(80) NOT NULL,
    `password` TEXT NOT NULL,

    UNIQUE INDEX `email_UNIQUE`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` VARCHAR(20) NULL,
    `imgUrl` VARCHAR(200) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryName` VARCHAR(30) NULL,
    `categoryId` VARCHAR(20) NOT NULL,
    `parentId` VARCHAR(20) NULL,

    UNIQUE INDEX `categoryId_UNIQUE`(`categoryId`),
    PRIMARY KEY (`id`, `categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_image` (
    `product_id` VARCHAR(20) NULL,
    `product_img_id` VARCHAR(20) NULL,
    `imgUrl` VARCHAR(200) NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    INDEX `product_id_idx`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prop_table` (
    `product_id` VARCHAR(20) NULL,
    `prop_id` VARCHAR(10) NULL,
    `prop_name` VARCHAR(20) NULL,
    `show_on_page` TINYINT NULL,
    `show_on_cate_page` TINYINT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `select_on_page` TINYINT NULL,
    `select_dropdown` TINYINT NULL,
    `checked_button` TINYINT NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sku_image` (
    `sku_id` VARCHAR(20) NULL,
    `product_id` VARCHAR(20) NULL,
    `sku_img_id` VARCHAR(20) NULL,
    `imgUrl` VARCHAR(200) NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    INDEX `sku_id_idx`(`sku_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sku_table` (
    `sku_id` VARCHAR(20) NULL,
    `product_id` VARCHAR(20) NULL,
    `stock` VARCHAR(20) NULL,
    `props1` VARCHAR(50) NULL,
    `props2` VARCHAR(50) NULL,
    `props3` VARCHAR(50) NULL,
    `props4` VARCHAR(50) NULL,
    `props5` VARCHAR(50) NULL,
    `props6` VARCHAR(50) NULL,
    `props7` VARCHAR(50) NULL,
    `props8` VARCHAR(50) NULL,
    `props9` VARCHAR(50) NULL,
    `props10` VARCHAR(50) NULL,
    `props11` VARCHAR(50) NULL,
    `props12` VARCHAR(50) NULL,
    `props13` VARCHAR(50) NULL,
    `props14` VARCHAR(50) NULL,
    `props15` VARCHAR(50) NULL,
    `props16` VARCHAR(50) NULL,
    `props17` VARCHAR(50) NULL,
    `props18` VARCHAR(50) NULL,
    `props19` VARCHAR(50) NULL,
    `props20` VARCHAR(50) NULL,
    `props21` VARCHAR(50) NULL,
    `props22` VARCHAR(50) NULL,
    `props23` VARCHAR(50) NULL,
    `props24` VARCHAR(50) NULL,
    `props25` VARCHAR(50) NULL,
    `props26` VARCHAR(50) NULL,
    `props27` VARCHAR(50) NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    INDEX `product_id_idx`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `root_category_id` VARCHAR(20) NULL,
    `category_id` VARCHAR(20) NULL,
    `product_id` VARCHAR(20) NOT NULL,
    `product_name` VARCHAR(40) NULL,
    `guarantee` VARCHAR(10) NULL,
    `order_method` VARCHAR(30) NULL,
    `delivery_fee` VARCHAR(10) NULL,
    `return` VARCHAR(20) NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    UNIQUE INDEX `product_id_UNIQUE`(`product_id`),
    UNIQUE INDEX `id_UNIQUE`(`id`),
    PRIMARY KEY (`id`, `product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `qa_table` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `QA_id` VARCHAR(20) NULL,
    `product_id` VARCHAR(20) NULL,
    `question` TEXT NULL,
    `question_date` DATE NULL,
    `question_user_email` TEXT NULL,
    `show_on_page` TINYINT NULL,
    `answer` TEXT NULL,
    `answer_date` DATE NULL,
    `answer_stuff_id` VARCHAR(20) NULL,
    `helpful_count` INTEGER NULL,

    INDEX `QA_id_idx`(`QA_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `qa_vote_table` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `QA_id` VARCHAR(20) NULL,
    `user_email` VARCHAR(80) NULL,

    UNIQUE INDEX `user_email_QA_id_unique_idx`(`user_email`, `QA_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `review_id` VARCHAR(20) NULL,
    `review_img_id` VARCHAR(20) NULL,
    `imgUrl` VARCHAR(200) NULL,

    INDEX `review_id_idx`(`review_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` VARCHAR(20) NULL,
    `review_id` VARCHAR(20) NULL,
    `nickname` VARCHAR(20) NULL,
    `user_email` VARCHAR(80) NULL,
    `review_date` DATE NULL,
    `review_score` INTEGER NULL,
    `product_subname` VARCHAR(50) NULL,
    `review_title` VARCHAR(50) NULL,
    `review_text` VARCHAR(500) NULL,
    `show_on_page` TINYINT NULL,
    `helpful_count` INTEGER NULL,
    `order_id` VARCHAR(50) NULL,

    UNIQUE INDEX `review_id_UNIQUE`(`review_id`),
    UNIQUE INDEX `user_email_order_id_unique_idx`(`user_email`, `order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_vote_table` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `review_id` VARCHAR(20) NULL,
    `user_email` VARCHAR(80) NULL,

    UNIQUE INDEX `user_email_review_id_unique_idx`(`user_email`, `review_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_order_table` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_email` VARCHAR(80) NULL,
    `product_id` VARCHAR(20) NULL,
    `product_subname` VARCHAR(50) NULL,
    `selection` VARCHAR(45) NULL,
    `order_date` DATE NULL,
    `imgUrl` VARCHAR(500) NULL,
    `order_id` VARCHAR(20) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favourite_products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_email` VARCHAR(80) NULL,
    `product_id` VARCHAR(20) NULL,
    `sku_subname` VARCHAR(50) NULL,
    `sku_price` VARCHAR(20) NULL,
    `sku_imgUrl` VARCHAR(200) NULL,
    `sku_id` VARCHAR(20) NULL,
    `selection` VARCHAR(80) NULL,
    `list_name` VARCHAR(20) NULL,

    UNIQUE INDEX `user_email_sku_id_unique_idx`(`user_email`, `sku_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_image` ADD CONSTRAINT `product_id` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sku_table` ADD CONSTRAINT `sku_table_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `review_image` ADD CONSTRAINT `review_id` FOREIGN KEY (`review_id`) REFERENCES `review`(`review_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

