package com.increff.employee.dto;

import com.increff.employee.model.*;
import com.increff.employee.pojo.BrandPojo;
import com.increff.employee.pojo.OrderItemPojo;
import com.increff.employee.pojo.ProductPojo;
import com.increff.employee.service.*;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class OrderDtoTest extends AbstractUnitTest {

    @Rule
    public ExpectedException expectedException;

    @Autowired
    private ProductService productService;

    @Autowired
    private BrandService brandService;

    @Autowired
    private OrderDto orderDto;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderItemService orderItemService;

    @Autowired
    private InventoryDto inventoryDto;

    @Test
    public void testAdd() throws ApiException {
        List<OrderForm> form = new ArrayList<>();

        ProductPojo p1 = generateProduct("boat","headphones","boat rockerz 200","efgh1234",2400);
        ProductPojo p2 = generateProduct("apple","headphones","apple airpod","abcd1234",12000);

        OrderForm form1 = new OrderForm();
        OrderForm form2 = new OrderForm();

        form1.setBarcode(p1.getBarcode());
        form1.setQuantity(20);
        form1.setSellingPrice(Integer.toString(2200));

        form2.setBarcode(p2.getBarcode());
        form2.setQuantity(15);
        form2.setSellingPrice(Integer.toString(11000));

        form.add(form1);
        form.add(form2);

        List<OrderItemData> data = orderDto.add(form);

        assertEquals(data.get(0).getBarcode(),form1.getBarcode());
        assertEquals(data.get(1).getBarcode(),form2.getBarcode());
    }

    @Test
    public void testGet() throws ApiException{
        ProductPojo p1 = generateProduct("boat","headphones","boat rockerz 200","efgh1234",2400);
        ProductPojo p2 = generateProduct("apple","headphones","apple airpod","abcd1234",12000);

        List<OrderForm> form = new ArrayList<>();
        OrderForm form1 = new OrderForm();
        form1.setBarcode(p1.getBarcode());
        form1.setQuantity(20);
        form1.setSellingPrice(Integer.toString(2100));

        OrderForm form2 = new OrderForm();
        form2.setBarcode(p2.getBarcode());
        form2.setQuantity(10);
        form2.setSellingPrice(Integer.toString(12000));

        form.add(form1);
        form.add(form2);

        List<OrderItemData> data = orderDto.add(form);
        List<OrderItemData> list = orderDto.getAllItems(data.get(0).getOrderId());

        for(int i=0;i<data.size();i++)
        {
            assertEquals(list.get(i).getName(),data.get(i).getName());
            assertEquals(list.get(i).getBarcode(),data.get(i).getBarcode());
        }
    }

    @Test
    public void testUpdate() throws ApiException{
        ProductPojo p1 = generateProduct("boat","headphones","boat rockerz 200","efgh1234",2400);
        ProductPojo p2 = generateProduct("apple","headphones","apple airpod","abcd1234",12000);

        List<OrderForm> form = new ArrayList<>();
        OrderForm form1 = new OrderForm();
        form1.setBarcode(p1.getBarcode());
        form1.setQuantity(20);
        form1.setSellingPrice(Integer.toString(2100));

        OrderForm form2 = new OrderForm();
        form2.setBarcode(p2.getBarcode());
        form2.setQuantity(10);
        form2.setSellingPrice(Integer.toString(12000));

        form.add(form1);
        form.add(form2);

        List<OrderItemData> data = orderDto.add(form);

        int newQuantity = 30;
        double newSellingPrice = 1399.99;

        OrderForm editForm = new OrderForm();
        editForm.setBarcode(data.get(0).getBarcode());
        editForm.setQuantity(newQuantity);
        editForm.setSellingPrice(Double.toString(newSellingPrice));

        List<OrderForm> updateFields = new ArrayList<>();
        updateFields.add(editForm);
        orderDto.update(data.get(0).getOrderId(), updateFields);

        List<OrderItemPojo> updatedData = orderItemService.getAllByOrderId(data.get(0).getOrderId());

        assertEquals(updatedData.get(0).getQuantity(),newQuantity);
    }

    @Test
    public void testGetAll() throws ApiException {
        ProductPojo p1 = generateProduct("boat","headphones","boat rockerz 200","efgh1234",2400);
        ProductPojo p2 = generateProduct("apple","headphones","apple airpod","abcd1234",12000);

        OrderForm form1 = new OrderForm();
        form1.setBarcode(p1.getBarcode());
        form1.setQuantity(20);
        form1.setSellingPrice(Integer.toString(2100));

        OrderForm form2 = new OrderForm();
        form2.setBarcode(p2.getBarcode());
        form2.setQuantity(10);
        form2.setSellingPrice(Integer.toString(12000));

        List<OrderForm> form = new ArrayList<>();

        form.add(form1);
        form.add(form2);

        List<OrderItemData> data = orderDto.add(form);
        List<OrderForm> orderForm = new ArrayList<>();

        orderForm.add(form1);

        List<OrderItemData> order2 = orderDto.add(orderForm);

        List<OrderData> orderData = orderDto.getAll();

        assertEquals(orderData.get(0).getId(),data.get(0).getOrderId());
    }

    public ProductPojo generateProduct(String brandName, String category, String name, String barcode, double mrp) throws ApiException {

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

        InventoryForm form = new InventoryForm();
        form.setBarcode(barcode);
        form.setQuantity(Integer.toString(1000));
        inventoryDto.increase(form);

        return prod;
    }
}