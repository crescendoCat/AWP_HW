# 測試用資料庫
此檔案為測試用資料庫，並非完整版本

## 安裝資料庫
如有安裝mysql環境，請在cmd輸入：
> $ mysql -u username -p -h localhost awp_test < awp_test.sql

其中username請改成root，或是任何你自己的mysql管理員帳號並輸入密碼，
就可以加入資料庫了

可以參考[這篇文章](https://stackoverflow.com/questions/11407349/mysql-how-to-export-and-import-a-sql-file-from-command-line)

## 新增資料庫的使用者授權
進入mysql控制介面後，輸入下列mysql query：
```sql
create user 'awpuser'@'localhost' identified by 'awpuser';
grant select,insert on awp_test.videos to 'awpuser'@'localhost';
```
