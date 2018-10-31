## 當PHP使用cURL相關函式送出http request時 遇到SSL問題
例如，使用下列PHP送出request之後
```php
$curl = curl_init();
curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => 'https://www.googleapis.com/youtube/v3/channels?part=statistics&id=b62Z5zpAEiU&key=AIzaSyBPS3aToTVD0SXGNYZpEgAwf43CahHK-58'
    
));
if(!($resl = curl_exec($curl))){
    die('Error: "' . curl_error($curl) . '" - Code: ' . curl_errno($curl));
}
```
得到：
 _SSL certificate problem: unable to get local issuer certificate_ 

錯誤訊息。

這種情況可以參考[這個網站](https://dotblogs.com.tw/jses88001/2014/08/10/146222)的解法
> ## 解法1
>參考來源: [[PHP]curl使用https遇到SSL certificate problem](http://taichunmin.pixnet.net/blog/post/35782941-%5Bphp%5Dcurl%E4%BD%BF%E7%94%A8https%E9%81%87%E5%88%B0ssl-certificate-problem)
>
>加入兩個設定CURLOPT_SSL_VERIFYHOST與CURLOPT_SSL_VERIFYPEER
>```php
>curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,0);
>curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,0);
>```
>或是
>```php
>$options = array(
>    CURLOPT_SSL_VERIFYHOST => 0,
>    CURLOPT_SSL_VERIFYPEER => 0,
>);
>curl_setopt_array($ch, $options);
>```

我則是使用第二種解法:

> ## 解法2(建議)
>參考來源: [PHP: curl_setopt - Manual](http://php.net/manual/en/function.curl-setopt.php#Hcom110457)
>
>1. 到[cURL - Extract CA Certs from Mozilla](http://curl.haxx.se/docs/caextract.html)下載[cacert.pem](http://curl.haxx.se/ca/cacert.pem)
>2. 在php.ini中加入
>```php
>url.cainfo="C:\php\cacert.pem"
>```
>3. 重開Apache

其中:
1. 根據php.ini的說明， _url.cainfo_ 的路徑必須是**絕對路徑**
2. 重開Apache可以用Apache安裝時提供的Apache Restart執行檔~
