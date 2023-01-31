package com.increff.employee.dto;

import com.increff.employee.model.*;
import com.increff.employee.pojo.BrandPojo;
import com.increff.employee.pojo.DailySalesPojo;
import com.increff.employee.pojo.InventoryPojo;
import com.increff.employee.pojo.ProductPojo;
import com.increff.employee.service.*;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class ReportDtoTest extends AbstractUnitTest {

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Autowired
    private BrandService brandService;

    @Autowired
    private ProductService productService;

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderDto orderDto;

    @Autowired
    private ProductDto productDto;

    @Autowired
    private ReportDto reportDto;

    @Test
    public void testGetInventory() throws ApiException {

        ProductPojo prod1 = generateProduct("jbl","speakers","jbl regular speakers","jbl1234",4500);

        OrderForm form1 = new OrderForm();
        form1.setBarcode(prod1.getBarcode());
        form1.setQuantity(20);
        form1.setSellingPrice(Integer.toString(4200));

        ProductPojo prod2 = generateProduct("jabra","speakers","jabra premium speakers","jabra1234",14500);

        OrderForm form2 = new OrderForm();
        form2.setBarcode(prod2.getBarcode());
        form2.setQuantity(10);
        form2.setSellingPrice(Integer.toString(13000));

        List<OrderForm> form = new ArrayList<>();

        form.add(form1);
        form.add(form2);

        orderDto.add(form);

        ReportForm inventoryReportForm = new ReportForm();
        inventoryReportForm.setBrand("jabra");
        inventoryReportForm.setCategory("speakers");

        List<InventoryReportData> inventoryList = reportDto.getInventories(inventoryReportForm);

        assertEquals(inventoryList.get(0).getQuantity(),990);
    }

    @Test
    public void testGetSales() throws ApiException {
        ProductPojo prod1 = generateProduct("jbl","speakers","jbl regular speakers","jbl1234",4500);
        OrderForm form1 = new OrderForm();
        form1.setBarcode(prod1.getBarcode());
        form1.setQuantity(20);
        form1.setSellingPrice(Double.toString(4200));

        ProductPojo prod2 = generateProduct("jabra","speakers","jabra premium speakers","jabra1234",14500);

        OrderForm form2 = new OrderForm();
        form2.setBarcode(prod2.getBarcode());
        form2.setQuantity(10);
        form2.setSellingPrice(Double.toString(13000));

        List<OrderForm> order = new ArrayList<>();
        order.add(form1);
        order.add(form2);

        orderDto.add(order);

        SalesReportForm salesReportForm = new SalesReportForm();
        Date StartDate = new Date();
        Date EndDate = new Date();

        salesReportForm.setStartDate(StartDate);
        salesReportForm.setEndDate(EndDate);
        salesReportForm.setCategory("speakers");
        salesReportForm.setBrand("jbl");

        List<SalesReportData> salesData = reportDto.getSales(salesReportForm);

        assertEquals(salesData.size(),1);
    }


    @Test
    public void testGetDaySales() throws ApiException{
        ProductPojo prod1 = generateProduct("jbl","speakers","jbl regular speakers","jbl1234",4500);
        OrderForm form1 = new OrderForm();
        form1.setBarcode(prod1.getBarcode());
        form1.setQuantity(20);
        form1.setSellingPrice(Integer.toString(4200));

        ProductPojo prod2 = generateProduct("jabra","speakers","jabra premium speakers","jabra1234",14500);

        OrderForm form2 = new OrderForm();
        form2.setBarcode(prod2.getBarcode());
        form2.setQuantity(10);
        form2.setSellingPrice(Integer.toString(13000));

        List<OrderForm> order = new ArrayList<>();
        order.add(form1);
        order.add(form2);

        orderDto.add(order);

        reportDto.saveDailySales();

        List<DailySalesPojo> daySalesData = reportDto.getDailySales();

        assertEquals(daySalesData.get(0).getItems(),2);

    }

    @Test
    public void testGetBrand() throws ApiException {
        ProductPojo prod1 = generateProduct("jbl","speakers","jbl regular speakers","jbl1234",4500);

        ReportForm form = new ReportForm();
        form.setCategory("speakers");
        form.setBrand("jbl");

        List<BrandForm> data = reportDto.getBrands(form);

        assertEquals(data.get(0).getName(),"jbl");
    }


    public ProductPojo generateProduct(String brandName, String category, String name, String barcode, double mrp) throws ApiException {

        BrandPojo brandPojo = new BrandPojo();

        brandPojo.setName(brandName);
        brandPojo.setCategory(category);

        BrandPojo pojo = brandService.add(brandPojo);

        ProductForm p = new ProductForm();

        p.setName(name);
        p.setCategory(brandPojo.getCategory());
        p.setBrand(brandPojo.getName());
        p.setMrp(Double.toString(mrp));
        p.setBarcode(barcode);

        ProductPojo prod = productDto.add(p);

        InventoryPojo form = new InventoryPojo();
        form.setId(prod.getId());
        form.setQuantity(1000);

        inventoryService.update(prod.getId(),form);

        return prod;
    }
}