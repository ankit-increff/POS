package com.increff.employee.dto;

import com.increff.employee.model.ProductData;
import com.increff.employee.model.ProductForm;
import com.increff.employee.pojo.BrandPojo;
import com.increff.employee.pojo.ProductPojo;
import com.increff.employee.service.AbstractUnitTest;
import com.increff.employee.service.ApiException;
import com.increff.employee.service.BrandService;
import com.increff.employee.service.ProductService;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.junit.Assert.assertEquals;

public class ProductDtoTest extends AbstractUnitTest {

    @Rule
    public ExpectedException exceptionRule = ExpectedException.none();

    @Autowired
    private BrandService brandService;

    @Autowired
    private ProductDto productDto;

    @Autowired
    private ProductService productService;

    @Test
    public void testAdd() throws ApiException {

        String brandName = "boat";
        String category = "headphones";
        String barcode = "efgh1234";
        String name = "boat rockerz 200";
        double mrp = 2400;

        BrandPojo brandPojo = new BrandPojo();

        brandPojo.setName(brandName);
        brandPojo.setCategory(category);

        brandService.add(brandPojo);

        ProductForm form = new ProductForm();

        form.setCategory(category);
        form.setBrand(brandName);
        form.setBarcode(barcode);
        form.setName(name);
        form.setMrp(Double.toString(mrp));

        ProductPojo data = productDto.add(form);

        assertEquals(data.getBarcode(),form.getBarcode());
        assertEquals(data.getName(),form.getName());
    }

    @Test
    public void testGetById() throws ApiException {
        String brandName = "boat";
        String category = "headphones";
        String barcode = "efgh1234";
        String name = "boat rockerz 200";
        double mrp = 2400;

        ProductPojo prod = generateProduct(brandName,category,name,barcode,mrp);

        ProductData d = productDto.get(prod.getId());

        assertEquals(d.getBarcode(),prod.getBarcode());
    }

    @Test
    public void testGetAll() throws ApiException {

        ProductPojo p1 = generateProduct("boat","headphones","boat rockerz 200","efgh1234",1400);
        ProductPojo p2 = generateProduct("apple","headphones","apple airpod","abcd1234",12000);

        List<ProductData> list = productDto.getAll();

        assertEquals(list.get(0).getName(),p1.getName());
        assertEquals(list.get(1).getName(),p2.getName());
    }

    @Test
    public void testUpdate() throws ApiException{
        String brandName = "boat";
        String category = "headphones";
        String name = "boat rockerz 200";
        String barcode = "efgh1234";
        double mrp = 1400;

        ProductPojo p = generateProduct(brandName,category,name,barcode,mrp);

        ProductForm updatedForm = new ProductForm();
        String updatedName = "boat rockerz 300";
        updatedForm.setName(updatedName);
        updatedForm.setBrand(brandName);
        updatedForm.setBarcode(barcode);
        updatedForm.setCategory(category);
        updatedForm.setMrp(Double.toString(mrp));

        ProductPojo data = productDto.update(p.getId(),updatedForm);

        assertEquals(data.getName(),updatedName);
    }

    public ProductPojo generateProduct(String brandName,String category,String name,String barcode,double mrp) throws ApiException {

        BrandPojo brandPojo = new BrandPojo();

        brandPojo.setName(brandName);
        brandPojo.setCategory(category);

        BrandPojo pojo = brandService.add(brandPojo);

        ProductPojo p = new ProductPojo();

        p.setName(name);
        p.setBrandId(pojo.getId());
        p.setMrp(mrp);
        p.setBarcode(barcode);
        ProductPojo prod = productService.add(p);

        return prod;
    }
}
