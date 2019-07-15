<?php
    function quan_ly_tin_tuc()
    {
        /*
        * Biến $label để chứa các text liên quan đến tên hiển thị của Post Type trong Admin
        */
        $label = array(
            'name' => 'Tin Tức', //Tên post type dạng số nhiều
            'singular_name' => 'Danh sách tin tức' //
        );
    
        /*
        * Biến $args là những tham số quan trọng trong Post Type
        */
        $args = array(
            'labels' => $label, //Gọi các label trong biến $label ở trên
            'description' => 'Tạo bảng tin mới', //Mô tả của post type
            'supports' => array(
                'title',
                'editor',
                'excerpt',
                'author',
                'thumbnail',
                'comments',
                'trackbacks',
                'revisions',
                'custom-fields'
            ), //Các tính năng được hỗ trợ trong post type
            'taxonomies' => array( 'category', 'post_tag' ), //Các taxonomy được phép sử dụng để phân loại nội dung
            'hierarchical' => false, //Cho phép phân cấp, nếu là false thì post type này giống như Post, true thì giống như Page
            'public' => true, //Kích hoạt post type
            'show_ui' => true, //Hiển thị khung quản trị như Post/Page
            'show_in_menu' => true, //Hiển thị trên Admin Menu (tay trái)
            'show_in_nav_menus' => true, //Hiển thị trong Appearance -> Menus
            'show_in_admin_bar' => true, //Hiển thị trên thanh Admin bar màu đen.
            'menu_position' => 2, //Thứ tự vị trí hiển thị trong menu (tay trái)
            'menu_icon' => 'dashicons-editor-paste-word', //Đường dẫn tới icon sẽ hiển thị
            'can_export' => true, //Có thể export nội dung bằng Tools -> Export
            'has_archive' => true, //Cho phép lưu trữ (month, date, year)
            'exclude_from_search' => false, //Loại bỏ khỏi kết quả tìm kiếm
            'publicly_queryable' => true, //Hiển thị các tham số trong query, phải đặt true
            'capability_type' => 'post' //
        );
    
        register_post_type('tintuc', $args); //Tạo post type với slug tên là sanpham và các tham số trong biến $args ở trên
    
    }
    add_action('init', 'quan_ly_tin_tuc');

    function thu_vien_anh()
    {
        /*
        * Biến $label để chứa các text liên quan đến tên hiển thị của Post Type trong Admin
        */
        $label = array(
            'name' => 'Thư viện hình ảnh', //Tên post type dạng số nhiều
            'singular_name' => 'Thư viện hình ảnh' //
        );
    
        /*
        * Biến $args là những tham số quan trọng trong Post Type
        */
        $args = array(
            'labels' => $label, //Gọi các label trong biến $label ở trên
            'description' => 'Tạo album ảnh', //Mô tả của post type
            'supports' => array(
                'title',
                'editor',
                'excerpt',
                'author',
                'thumbnail',
                'comments',
                'trackbacks',
                'revisions',
                'custom-fields'
            ), //Các tính năng được hỗ trợ trong post type
            'taxonomies' => array( 'category', 'post_tag' ), //Các taxonomy được phép sử dụng để phân loại nội dung
            'hierarchical' => false, //Cho phép phân cấp, nếu là false thì post type này giống như Post, true thì giống như Page
            'public' => true, //Kích hoạt post type
            'show_ui' => true, //Hiển thị khung quản trị như Post/Page
            'show_in_menu' => true, //Hiển thị trên Admin Menu (tay trái)
            'show_in_nav_menus' => true, //Hiển thị trong Appearance -> Menus
            'show_in_admin_bar' => true, //Hiển thị trên thanh Admin bar màu đen.
            'menu_position' => 2, //Thứ tự vị trí hiển thị trong menu (tay trái)
            'menu_icon' => 'dashicons-editor-paste-word', //Đường dẫn tới icon sẽ hiển thị
            'can_export' => true, //Có thể export nội dung bằng Tools -> Export
            'has_archive' => true, //Cho phép lưu trữ (month, date, year)
            'exclude_from_search' => false, //Loại bỏ khỏi kết quả tìm kiếm
            'publicly_queryable' => true, //Hiển thị các tham số trong query, phải đặt true
            'capability_type' => 'post' //
        );
    
        register_post_type('hinhanh', $args); //Tạo post type với slug tên là sanpham và các tham số trong biến $args ở trên
    
    }
    add_action('init', 'thu_vien_anh');

    function thu_vien_kinh_sach()
    {
        /*
        * Biến $label để chứa các text liên quan đến tên hiển thị của Post Type trong Admin
        */
        $label = array(
            'name' => 'Thư viện Kinh sách', //Tên post type dạng số nhiều
            'singular_name' => 'Thư viện kinh sách' //
        );
    
        /*
        * Biến $args là những tham số quan trọng trong Post Type
        */
        $args = array(
            'labels' => $label, //Gọi các label trong biến $label ở trên
            'description' => 'Thêm kinh sách', //Mô tả của post type
            'supports' => array(
                'title',
                'editor',
                'excerpt',
                'author',
                'thumbnail',
                'comments',
                'trackbacks',
                'revisions',
                'custom-fields'
            ), //Các tính năng được hỗ trợ trong post type
            'taxonomies' => array( 'category', 'post_tag' ), //Các taxonomy được phép sử dụng để phân loại nội dung
            'hierarchical' => false, //Cho phép phân cấp, nếu là false thì post type này giống như Post, true thì giống như Page
            'public' => true, //Kích hoạt post type
            'show_ui' => true, //Hiển thị khung quản trị như Post/Page
            'show_in_menu' => true, //Hiển thị trên Admin Menu (tay trái)
            'show_in_nav_menus' => true, //Hiển thị trong Appearance -> Menus
            'show_in_admin_bar' => true, //Hiển thị trên thanh Admin bar màu đen.
            'menu_position' => 4, //Thứ tự vị trí hiển thị trong menu (tay trái)
            'menu_icon' => 'dashicons-editor-paste-word', //Đường dẫn tới icon sẽ hiển thị
            'can_export' => true, //Có thể export nội dung bằng Tools -> Export
            'has_archive' => true, //Cho phép lưu trữ (month, date, year)
            'exclude_from_search' => false, //Loại bỏ khỏi kết quả tìm kiếm
            'publicly_queryable' => true, //Hiển thị các tham số trong query, phải đặt true
            'capability_type' => 'post' //
        );
    
        register_post_type('kinhsach', $args); //Tạo post type với slug tên là sanpham và các tham số trong biến $args ở trên
    
    }
    add_action('init', 'thu_vien_kinh_sach');

    function phap_am()
    {
        /*
        * Biến $label để chứa các text liên quan đến tên hiển thị của Post Type trong Admin
        */
        $label = array(
            'name' => 'Pháp âm', //Tên post type dạng số nhiều
            'singular_name' => 'Pháp âm' //
        );
    
        /*
        * Biến $args là những tham số quan trọng trong Post Type
        */
        $args = array(
            'labels' => $label, //Gọi các label trong biến $label ở trên
            'description' => 'Thêm pháp âm', //Mô tả của post type
            'supports' => array(
                'title',
                'editor',
                'excerpt',
                'author',
                'thumbnail',
                'comments',
                'trackbacks',
                'revisions',
                'custom-fields'
            ), //Các tính năng được hỗ trợ trong post type
            'taxonomies' => array( 'category', 'post_tag' ), //Các taxonomy được phép sử dụng để phân loại nội dung
            'hierarchical' => false, //Cho phép phân cấp, nếu là false thì post type này giống như Post, true thì giống như Page
            'public' => true, //Kích hoạt post type
            'show_ui' => true, //Hiển thị khung quản trị như Post/Page
            'show_in_menu' => true, //Hiển thị trên Admin Menu (tay trái)
            'show_in_nav_menus' => true, //Hiển thị trong Appearance -> Menus
            'show_in_admin_bar' => true, //Hiển thị trên thanh Admin bar màu đen.
            'menu_position' => 5, //Thứ tự vị trí hiển thị trong menu (tay trái)
            'menu_icon' => 'dashicons-editor-paste-word', //Đường dẫn tới icon sẽ hiển thị
            'can_export' => true, //Có thể export nội dung bằng Tools -> Export
            'has_archive' => true, //Cho phép lưu trữ (month, date, year)
            'exclude_from_search' => false, //Loại bỏ khỏi kết quả tìm kiếm
            'publicly_queryable' => true, //Hiển thị các tham số trong query, phải đặt true
            'capability_type' => 'post' //
        );
    
        register_post_type('phapam', $args); //Tạo post type với slug tên là sanpham và các tham số trong biến $args ở trên
    
    }
    add_action('init', 'phap_am');

    function goc_chia_se()
    {
        /*
        * Biến $label để chứa các text liên quan đến tên hiển thị của Post Type trong Admin
        */
        $label = array(
            'name' => 'Góc chia sẻ', //Tên post type dạng số nhiều
            'singular_name' => 'Góc chia sẻ' //
        );
    
        /*
        * Biến $args là những tham số quan trọng trong Post Type
        */
        $args = array(
            'labels' => $label, //Gọi các label trong biến $label ở trên
            'description' => 'Thêm bài viết', //Mô tả của post type
            'supports' => array(
                'title',
                'editor',
                'excerpt',
                'author',
                'thumbnail',
                'comments',
                'trackbacks',
                'revisions',
                'custom-fields'
            ), //Các tính năng được hỗ trợ trong post type
            'taxonomies' => array( 'category', 'post_tag' ), //Các taxonomy được phép sử dụng để phân loại nội dung
            'hierarchical' => false, //Cho phép phân cấp, nếu là false thì post type này giống như Post, true thì giống như Page
            'public' => true, //Kích hoạt post type
            'show_ui' => true, //Hiển thị khung quản trị như Post/Page
            'show_in_menu' => true, //Hiển thị trên Admin Menu (tay trái)
            'show_in_nav_menus' => true, //Hiển thị trong Appearance -> Menus
            'show_in_admin_bar' => true, //Hiển thị trên thanh Admin bar màu đen.
            'menu_position' => 6, //Thứ tự vị trí hiển thị trong menu (tay trái)
            'menu_icon' => 'dashicons-editor-paste-word', //Đường dẫn tới icon sẽ hiển thị
            'can_export' => true, //Có thể export nội dung bằng Tools -> Export
            'has_archive' => true, //Cho phép lưu trữ (month, date, year)
            'exclude_from_search' => false, //Loại bỏ khỏi kết quả tìm kiếm
            'publicly_queryable' => true, //Hiển thị các tham số trong query, phải đặt true
            'capability_type' => 'post' //
        );
    
        register_post_type('gocchiase', $args); //Tạo post type với slug tên là sanpham và các tham số trong biến $args ở trên
    
    }
    add_action('init', 'goc_chia_se');

    function quan_ly_anh_bia()
    {
        /*
        * Biến $label để chứa các text liên quan đến tên hiển thị của Post Type trong Admin
        */
        $label = array(
            'name' => 'Quản lý ảnh bìa', //Tên post type dạng số nhiều
            'singular_name' => 'Quản lý ảnh bìa' //
        );
    
        /*
        * Biến $args là những tham số quan trọng trong Post Type
        */
        $args = array(
            'labels' => $label, //Gọi các label trong biến $label ở trên
            'description' => 'Tạo Poster', //Mô tả của post type
            'supports' => array(
                'title',
                'editor',
                'excerpt',
                'author',
                'thumbnail',
                'comments',
                'trackbacks',
                'revisions',
                'custom-fields'
            ), //Các tính năng được hỗ trợ trong post type
            'taxonomies' => array( 'category', 'post_tag' ), //Các taxonomy được phép sử dụng để phân loại nội dung
            'hierarchical' => false, //Cho phép phân cấp, nếu là false thì post type này giống như Post, true thì giống như Page
            'public' => true, //Kích hoạt post type
            'show_ui' => true, //Hiển thị khung quản trị như Post/Page
            'show_in_menu' => true, //Hiển thị trên Admin Menu (tay trái)
            'show_in_nav_menus' => true, //Hiển thị trong Appearance -> Menus
            'show_in_admin_bar' => true, //Hiển thị trên thanh Admin bar màu đen.
            'menu_position' => 7, //Thứ tự vị trí hiển thị trong menu (tay trái)
            'menu_icon' => 'dashicons-editor-paste-word', //Đường dẫn tới icon sẽ hiển thị
            'can_export' => true, //Có thể export nội dung bằng Tools -> Export
            'has_archive' => true, //Cho phép lưu trữ (month, date, year)
            'exclude_from_search' => false, //Loại bỏ khỏi kết quả tìm kiếm
            'publicly_queryable' => true, //Hiển thị các tham số trong query, phải đặt true
            'capability_type' => 'post' //
        );
    
        register_post_type('postercategory', $args); //Tạo post type với slug tên là sanpham và các tham số trong biến $args ở trên
    
    }
    add_action('init', 'quan_ly_anh_bia');
?>