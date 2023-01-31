package com.increff.employee.dto;

import com.increff.employee.model.InventoryData;
import com.increff.employee.model.InventoryForm;
import com.increff.employee.pojo.BrandPojo;
import com.increff.employee.pojo.InventoryPojo;
import com.increff.employee.pojo.ProductPojo;
import com.increff.employee.service.*;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.junit.Assert.assertEquals;

public class InventoryDtoTest extends AbstractUnitTest {

    @Rule
    public ExpectedException exceptionRule = ExpectedException.none();

    @Autowired
    private InventoryDto inventoryDto;

    @Autowired
    private ProductDto productDto;

    @Autowired
    private BrandService brandService;

    @Autowired
    private ProductService productService;

    @Autowired
    private InventoryService inventoryService;


    @Test
    public void testCreate() throws ApiException {

        String barcode = "efgh1234";
        String brandName = "boat";
        String category = "headphones";
        double mrp = 2000;
        String name = "boat rockerz 200";

        BrandPojo brandPojo = new BrandPojo();

        brandPojo.setName(brandName);
        brandPojo.setCategory(category);
        brandService.add(brandPojo);

        ProductPojo p = new ProductPojo();
        p.setBarcode(barcode);
        p.setBrandId(brandPojo.getId());
        p.setMrp(mrp);
        p.setName(name);
        ProductPojo productPojo =  productService.add(p);

        int newQuantity = 8000;

        InventoryForm form = new InventoryForm();
        form.setBarcode(barcode);
        form.setQuantity(Integer.toString(newQuantity));
        inventoryDto.increase(form);


        InventoryPojo data = inventoryService.get(productPojo.getId());

        assertEquals(data.getQuantity(),newQuantity);

    }

    @Test
    public void testGet() throws ApiException {

        String barcode = "efgh1234";
        String brandName = "boat";
        String category = "headphones";
        double mrp = 2000;
        String name = "boat rockerz 200";

        BrandPojo brandPojo = new BrandPojo();

        brandPojo.setName(brandName);
        brandPojo.setCategory(category);
        brandService.add(brandPojo);

        ProductPojo p = new ProductPojo();
        p.setBarcode(barcode);
        p.setBrandId(brandPojo.getId());
        p.setMrp(mrp);
        p.setName(name);
        ProductPojo productPojo =  productService.add(p);

        InventoryData data = inventoryDto.get(barcode);

        assertEquals(data.getQuantity(),Integer.toString(0));

    }

    @Test
    public void testGetAll() throws ApiException {
        String barcode = "efgh1234";
        int quantity = 15;
        String brandName = "boat";
        String category = "headphones";
        double mrp = 2100;
        String name = "boat rockerz";
        InventoryForm form = getInventoryForm(barcode,quantity,brandName,category,mrp,name);

        String barcode2 = "abcd1234";
        int quantity2 = 25;
        String brandName2 = "apple";
        String category2 = "headphones";
        double mrp2 = 2100;
        String name2 = "apple earbud";
        InventoryForm form2 = getInventoryForm(barcode2,quantity2,brandName2,category2,mrp2,name2);

        inventoryDto.increase(form);
        inventoryDto.increase(form2);

        List<InventoryData> list = inventoryDto.getAll();

        assertEquals(list.get(0).getBarcode(),barcode);
        assertEquals(list.get(0).getQuantity(),Integer.toString(quantity));

        assertEquals(list.get(1).getBarcode(),barcode2);
        assertEquals(list.get(1).getQuantity(),Integer.toString(quantity2));
    }

    @Test
    public void testUpdate() throws ApiException {
        String barcode = "efgh1234";
        int quantity = 15;
        String brandName = "boat";
        String category = "headphones";
        double mrp = 2100;
        String name = "boat rockerz";
        InventoryForm form = getInventoryForm(barcode,quantity,brandName,category,mrp,name);

        inventoryDto.increase(form);

        InventoryForm updatedForm = new InventoryForm();
        int newQuantity = 20;

        updatedForm.setBarcode("efgh1234");
        updatedForm.setQuantity(Integer.toString(newQuantity));

        inventoryDto.update(barcode, updatedForm);
        InventoryPojo data = inventoryService.get(productService.get(barcode).getId());

        assertEquals(data.getQuantity(),newQuantity);
    }

    public InventoryForm getInventoryForm(String barcode,int quantity,String brandName,String category,double mrp,String name) throws ApiException {
        BrandPojo brandPojo = new BrandPojo();

        brandPojo.setName(brandName);
        brandPojo.setCategory(category);

        brandService.add(brandPojo);

        ProductPojo p = new ProductPojo();

        p.setBarcode(barcode);
        p.setBrandId(brandPojo.getId());
        p.setMrp(mrp);
        p.setName(name);
        productService.add(p);

        InventoryForm form = new InventoryForm();
        form.setBarcode(barcode);
        form.setQuantity(Integer.toString(quantity));

        return form;
    }
}