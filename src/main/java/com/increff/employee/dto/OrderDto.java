package com.increff.employee.dto;

import com.increff.employee.model.*;
import com.increff.employee.pojo.*;
import com.increff.employee.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.*;

@Component
public class OrderDto {

    @Autowired
    OrderService service;
    @Autowired
    OrderItemService itemService;
    @Autowired
    ProductService productService;
    @Autowired
    InventoryService inventoryService;

    //ADDING AN ORDER
    @Transactional(rollbackOn = ApiException.class)
    public void add(List<OrderForm> forms) throws ApiException {
        if(forms.size()==0) {
            throw new ApiException("Add some products!");
        }

        for(OrderForm f:forms)
        {
            checkInventory(f);
            checkValidity(f);
            checkPrice(f);
        }

        OrderPojo p = new OrderPojo();
        Date date = new Date();
        p.setDate(date);
        int orderId = service.add(p);

        for(OrderForm f:forms)
        {
            OrderItemPojo itemPojo = convert(f);

            //INVENTORY UPDATE
            updateInventory(f, itemPojo.getProductId());

            itemPojo.setOrderId(orderId);
            itemService.add(itemPojo);
        }
    }

    //GETTING ALL ORDERS
    @Transactional(rollbackOn = ApiException.class)
    public List<OrderData> getAll() throws ApiException {
        List<OrderData> orderData = new ArrayList<>();

        List<OrderPojo> orders= service.getAll();
        for(OrderPojo order : orders)
        {
            OrderData data = convert(order);
            orderData.add(data);
        }
        return orderData;
    }

    //DISABLE INVOICE
    @Transactional(rollbackOn = ApiException.class)
    public void disableInvoice(int id) throws ApiException {
        service.get(id).setInvoiceGenerated(true);
    }

    //GETTING ALL ORDER ITEMS BY ORDER ID
    @Transactional(rollbackOn = ApiException.class)
    public List<OrderItemData> getAllItems( int orderId) throws ApiException {
        List<OrderItemData> itemData = new ArrayList<>();

        List<OrderItemPojo> items= itemService.getAllByOrderId(orderId);
        for(OrderItemPojo p : items)
        {
            OrderItemData d = convert(p);
            itemData.add(d);
        }
        return itemData;
    }
    @Transactional(rollbackOn = ApiException.class)
    public List<BillData> generateInvoice(int orderId) throws ApiException {
        List<BillData> reqBill = new ArrayList<BillData>();
        OrderPojo order = service.get(orderId);
        List<OrderItemPojo> allItems = itemService.getAllByOrderId(orderId);
        for(OrderItemPojo p:allItems) {
            BillData item = new BillData();
            ProductPojo product = productService.get(p.getProductId());
            item.setBarcode(product.getBarcode());
            item.setName(product.getName());
            item.setQuantity(p.getQuantity());
            item.setPrice(p.getSellingPrice());
            item.setDate(order.getDate());
            item.setId(order.getId());
            reqBill.add(item);
        }
        return reqBill;
    }

    //-------------------------------------------------------------------------------------------------------
    //UPDATING AN ORDER BY ORDER ID
    @Transactional(rollbackOn = ApiException.class)
    public void update(int orderId, List<OrderForm> newForms) throws ApiException {
        if(newForms.size()==0) {
            throw new ApiException("Add some products!");
        }

        List<OrderItemPojo> oldItems = itemService.getAllByOrderId(orderId);

        for(OrderForm f:newForms)
        {
            checkQuantity(oldItems, f);
            checkPrice(f);
            checkValidity(f);
        }

        //REVERTING OLD CHANGES IN INVENTORY
        for(OrderItemPojo item:oldItems)
        {
            int productId = item.getProductId();
            int oldQuantity = inventoryService.get(productId).getQuantity();
            inventoryService.get(productId).setQuantity(oldQuantity + item.getQuantity());
        }
        //TIME UPDATE IN ORDER TABLE
        OrderPojo p = service.get(orderId);
        Date date = new Date();
        p.setDate(date);

        //INVENTORY UPDATE A/C TO NEW REQUIREMENTS
        Map<Integer, OrderForm> orderFormMap = new HashMap<>(); //map<productid, form>
        for(OrderForm f:newForms) {
            int productId = productService.get(f.getBarcode()).getId();
            orderFormMap.put(productId, f);
            updateInventory(f,productId);
        }

        //ORDER ITEM MANAGEMENT
        for(OrderItemPojo itemPojo : oldItems) {
            OrderForm f = orderFormMap.get(itemPojo.getProductId());
            if(f != null) {
                itemPojo.setQuantity(f.getQuantity());
                itemPojo.setSellingPrice(Double.parseDouble(f.getSellingPrice()));
                orderFormMap.remove(itemPojo.getProductId());
            }
            else {
                itemService.delete(itemPojo.getId());
            }
        }

        for(OrderForm f : orderFormMap.values())
        {
            OrderItemPojo itemPojo = convert(f);

            itemPojo.setOrderId(orderId);
            itemService.add(itemPojo);
        }

    }
    //----------------------------------------------------------------------------------------------------

    //UTILITIES
    private void checkQuantity(List<OrderItemPojo> oldItems, OrderForm newForm) throws ApiException {
        int productId = productService.get(newForm.getBarcode()).getId();
        for(OrderItemPojo f:oldItems) {
            if(f.getProductId() == productId) {
                if(f.getQuantity() < newForm.getQuantity()) {
                    OrderForm dummyForm = new OrderForm();
                    dummyForm.setBarcode(newForm.getBarcode());
                    dummyForm.setQuantity(newForm.getQuantity()-f.getQuantity());
                    dummyForm.setSellingPrice(newForm.getSellingPrice());
                    checkInventory(dummyForm);
                }
                return;
            }
        }
        checkInventory(newForm);
    }

    private OrderItemPojo convert(OrderForm form) throws ApiException {
        OrderItemPojo p = new OrderItemPojo();

        ProductPojo product = productService.get(form.getBarcode());
        p.setQuantity(form.getQuantity());
        p.setSellingPrice(Double.parseDouble(form.getSellingPrice()));
        p.setProductId(product.getId());
        return p;
    }

    private OrderData convert(OrderPojo p) {

        OrderData data = new OrderData();
        data.setDate(p.getDate());
        data.setId(p.getId());
        data.setInvoiceGenerated(p.isInvoiceGenerated());
        double totalAmount = 0;
        List<OrderItemPojo> itemPojos = itemService.getAllByOrderId(p.getId());
        for(OrderItemPojo itemPojo : itemPojos)
        {
            totalAmount+=itemPojo.getSellingPrice()* itemPojo.getQuantity();
        }
        data.setAmount(totalAmount);

        return data;
    }

    private void checkInventory(OrderForm f) throws ApiException {
        int id = productService.get(f.getBarcode()).getId();

        InventoryPojo p = inventoryService.get(id);
        int mx = p.getQuantity();
        if(f.getQuantity() > mx) throw new ApiException("Inventory contains only "+mx+" items of product with barcode "+f.getBarcode());
    }

    private void checkValidity(OrderForm f) throws ApiException {
        if(f.getQuantity()<0) {
            throw new ApiException("Invalid quantity!!");
        }
        if(Double.parseDouble(f.getSellingPrice())<0) {
            throw new ApiException("Invalid selling price!!");
        }
    }

    private void checkPrice(OrderForm f) throws ApiException {
        double mrp = productService.get(f.getBarcode()).getMrp();
        if(Double.parseDouble(f.getSellingPrice())>mrp) {
            throw new ApiException("Selling price should not be greater than Mrp. (Barcode:"+f.getBarcode()+", MRP: "+mrp+")");
        }
    }

    @Transactional(rollbackOn = ApiException.class)
    private void updateInventory(OrderForm form,int id)  throws ApiException {
        InventoryPojo p = inventoryService.get(id);
        int curr = p.getQuantity();
        p.setQuantity(curr-form.getQuantity());
        inventoryService.update(id, p);
    }

    private OrderItemData convert(OrderItemPojo p) throws ApiException {

        OrderItemData d = new OrderItemData();
        d.setOrderId(p.getOrderId());
        d.setQuantity(p.getQuantity());
        d.setSellingPrice(p.getSellingPrice());

        ProductPojo product = productService.get(p.getProductId());
        d.setName(product.getName());
        d.setBarcode(product.getBarcode());
        return d;
    }



}
