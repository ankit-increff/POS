package com.increff.employee.dto;

import com.increff.employee.model.BrandData;
import com.increff.employee.model.BrandForm;
import com.increff.employee.pojo.BrandPojo;
import com.increff.employee.service.AbstractUnitTest;
import com.increff.employee.service.ApiException;
import com.increff.employee.service.BrandService;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class BrandDtoTest extends AbstractUnitTest {

    @Rule
    public ExpectedException exceptionRule = ExpectedException.none();

    @Autowired
    private BrandDto brandDto;

    @Autowired
    private BrandService brandService;

    @Test
    public void testNormalize(){
        BrandPojo p = new BrandPojo();
        String name = "Boat ";
        String category = "Headphones ";
        p.setName(name);
        p.setCategory(category);

        BrandDto.normalize(p);

        assertEquals(p.getName(),"boat");
        assertEquals(p.getCategory(),"headphones");
    }

//    @Test
//    public void testAdd() throws ApiException {
//        BrandForm form = new BrandForm();
//        String name = "boat";
//        String category = "headphones";
//        form.setName(name);
//        form.setCategory(category);
//
//        BrandData data = brandDto.add(form);
//
//        BrandPojo p = BrandDto.convert(form);
//        BrandDto.normalize(p);
//
//        assertEquals(data.getName(),p.getName());
//        assertEquals(data.getCategory(),p.getCategory());
//
//    }
//
//    @Test
//    public void testAddWithInvalidEntry() throws ApiException {
//        BrandForm form = new BrandForm();
//        String name = "";
//        String category = "headphones";
//        form.setName(name);
//        form.setCategory(category);
//
//        exceptionRule.expect(ApiException.class);
//        BrandData data = brandDto.add(form);
//
//        BrandPojo p = BrandDto.convert(form);
//        BrandDto.normalize(p);
//
//        assertEquals(data.getName(),p.getName());
//        assertEquals(data.getCategory(),p.getCategory());
//
//    }
//
//
//
//    @Test
//    public void testGetById() throws ApiException {
//        BrandPojo p = new BrandPojo();
//        String name = "boat";
//        String category = "headphones";
//
//        p.setName(name);
//        p.setCategory(category);
//
//        BrandDto.normalize(p);
//        BrandPojo pojo = brandService.add(p);
//
//        BrandData data = brandDto.get(pojo.getId());
//
//        assertEquals(data.getName(),pojo.getName());
//        assertEquals(data.getCategory(),pojo.getCategory());
//
//    }
//
//    @Test
//    public void testGetByIdWithInvalidId() throws ApiException {
//        exceptionRule.expect(ApiException.class);
//        BrandData data = brandDto.get(123456);
//
//    }
//
//
//    @Test
//    public void testGetAll() throws ApiException {
//        List<BrandData> list = new ArrayList<>();
//        BrandPojo p1 = new BrandPojo();
//        BrandPojo p2 = new BrandPojo();
//        p1.setName("boat");
//        p1.setCategory("headphones");
//
//        BrandDto.normalize(p1);
//
//        p2.setName("apple");
//        p2.setCategory("headphones");
//
//        BrandDto.normalize(p2);
//
//
//        BrandPojo pojo1 = brandService.add(p1);
//        BrandPojo pojo2 = brandService.add(p2);
//
//        list = brandDto.getAll();
//
//        assertEquals(list.get(0).getName(),pojo1.getName());
//        assertEquals(list.get(0).getCategory(),pojo1.getCategory());
//        assertEquals(list.get(1).getName(),pojo2.getName());
//        assertEquals(list.get(1).getCategory(),pojo2.getCategory());
//
//    }
//
//    @Test
//    public void testUpdate() throws ApiException {
//        BrandForm form = new BrandForm();
//        String name = "boat";
//        String category = "headphones";
//        form.setName(name);
//        form.setCategory(category);
//
//        BrandPojo p = BrandDto.convert(form);
//
//        BrandPojo pojo = brandService.add(p);
//
//        BrandForm updatedForm = new BrandForm();
//        updatedForm.setName("apple");
//        updatedForm.setCategory("headphones");
//
//        BrandData updatedData = brandDto.update(pojo.getId(),updatedForm);
//
//        assertEquals(updatedData.getName(),"apple");
//        assertEquals(updatedData.getCategory(),"headphones");
//
//
//    }
//
//    @Test
//    public void testGetByBrandAndCategory() throws ApiException {
//        BrandForm form = new BrandForm();
//        String name = "boat";
//        String category = "headphones";
//        form.setName(name);
//        form.setCategory(category);
//
//        BrandPojo p = BrandDto.convert(form);
//
//        BrandPojo pojo = brandService.add(p);
//
//        BrandPojo data = brandDto.get(pojo.getName(),pojo.getCategory());
//
//        assertEquals(data.getId(),pojo.getId());
//
//    }
//
//
//    @Test
//    public void testGetCategoryList() throws ApiException {
//        BrandPojo p1 = new BrandPojo();
//        BrandPojo p2 = new BrandPojo();
//        p1.setName("boat");
//        p1.setCategory("headphones");
//
//        BrandDto.normalize(p1);
//
//        p2.setName("apple");
//        p2.setCategory("smartphone");
//
//        BrandDto.normalize(p2);
//
//        brandService.add(p1);
//        brandService.add(p2);
//
//        List<String> list = brandDto.getCategory();
//
//        assertEquals(list.size(),2);
//
//
//    }
//
//    @Test
//    public void testGetBrandList() throws ApiException {
//        BrandPojo p1 = new BrandPojo();
//        BrandPojo p2 = new BrandPojo();
//        p1.setName("apple");
//        p1.setCategory("headphones");
//
//        BrandDto.normalize(p1);
//
//        p2.setName("apple");
//        p2.setCategory("smartphone");
//
//        BrandDto.normalize(p2);
//
//        brandService.add(p1);
//        brandService.add(p2);
//
//        List<String> list = brandDto.getBrandList();
//
//        assertEquals(list.size(),1);
//
//    }
//
//    @Test
//    public void testGetBrandByCategory() throws ApiException {
//        BrandPojo p1 = new BrandPojo();
//        BrandPojo p2 = new BrandPojo();
//        String category = "headphones";
//
//        p1.setName("boat");
//        p1.setCategory(category);
//
//        BrandDto.normalize(p1);
//
//        p2.setName("apple");
//        p2.setCategory(category);
//
//        BrandDto.normalize(p2);
//
//        brandService.add(p1);
//        brandService.add(p2);
//
//        List<String> brandList = brandDto.getBrandByCategory(category);
//
//        assertEquals(brandList.size(),2);
//    }
//
//    @Test
//    public void testGetCategoryByBrand() throws ApiException {
//        BrandPojo p1 = new BrandPojo();
//        BrandPojo p2 = new BrandPojo();
//        String brand = "apple";
//
//        p1.setName(brand);
//        p1.setCategory("headphones");
//
//        BrandDto.normalize(p1);
//
//        p2.setName(brand);
//        p2.setCategory("smartphone");
//
//        BrandDto.normalize(p2);
//
//        brandService.add(p1);
//        brandService.add(p2);
//
//        List<String> brandList = brandDto.getCategoryByBrand(brand);
//
//        assertEquals(brandList.size(),2);
//    }
}
