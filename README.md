## 列表接口
get /books
### 请求的URL格式
```
/books
/books/1
/books?pageSize=5&pageNumber=2
```
### 返回的数据格式
```
{
  data:[{id:1,name:'zfpx1'}],
  totalPage:3,
  pageSize:5,
  pageNumber:2
}
```

```
<nav>
  <ul class="pagination">
    <li><a href="#">&laquo;</a></li>
    <li><a href="#">1</a></li>
    <li><a href="#">&raquo;</a></li>
  </ul>
</nav>

```