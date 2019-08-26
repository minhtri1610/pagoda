<?php
    include('list_categories.php');

    function getPageName($str_page)
    {
        $str_v_name = '';
        switch ($str_page) {
            case 'tin-tuc':
                $str_v_name = __('Tin tức');break;
            case 'phap-am':
                $str_v_name = __('Pháp âm');break;
            case 'hinh-anh':
                $str_v_name = __('Thư viện hình ảnh');break;
            case 'kinh-sach':
                $str_v_name = __('Thư viện kinh sách');break;
            case 'goc-chia-se':
                $str_v_name = __('Góc chia sẻ');break;
            case 'lien-he':
                $str_v_name = __('Liên hệ');break;
            default:
            break;
        }
        return $str_v_name;
    }
?>