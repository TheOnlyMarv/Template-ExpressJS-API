import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCheckedForListEntry1508151627195 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `test`.`list_entry` ADD `checked` tinyint(4) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `test`.`list_entry` DROP `checked`");
    }

}
